const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const fileUpload = require("express-fileupload");
const routes = require("./routes");
const Message = require("./database");
const { createAdapter } = require("@socket.io/mongo-adapter");
const { MongoClient } = require("mongodb");

// Configurações e constantes do MongoDB
const DB = "chat";
const COLLECTION = "socket.io-adapter-events";
const GROUP_COLLECTION_PREFIX = "group_";
const mongoClient = new MongoClient("mongodb://127.0.0.1:27017");

// Inicializando o servidor Express
const app = express();
app.use(cors());


// Criando uma instância do servidor HTTP e vinculando o Socket.io a ela
const server = http.createServer(app);
app.use(express.json());
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});

// Middlewares para upload de arquivos e roteamento
app.use(fileUpload());
app.use("/api", routes);
app.use("/", express.static(path.join(__dirname, "static")));

// Rota raiz para verificar se o servidor está em execução
app.get("/", (req, res) => {
  res.send("Server is running");
});

function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
}
app.use(errorHandler);
module.exports = app;

let groupList = [];

groupList[
  ("Gerência",
  "Financeiro",
  "Vendas",
  "Compras",
  "Estoque",
  "Recursos Humanos",
  "Geral")
],
  async function connectToMongoDB() {
    try {
      await mongoClient.connect();
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
    }
  };

try {
  (async () => {
    (async () => {
      const collections = await mongoClient.db(DB).listCollections().toArray();
    })();
  })();
  (async () => {
    const collections = await mongoClient.db(DB).listCollections().toArray();
    const collectionNames = collections.map((c) => c.name);
    if (!collectionNames.includes(COLLECTION)) {
      mongoClient.db(DB).createCollection(COLLECTION, {
        capped: true,
        size: 1e6,
      });
    }
  })();
  for (let group of groupList) {
    const collectionName = GROUP_COLLECTION_PREFIX + group.replace(/\s+/g, "_");
    if (!collectionNames.includes(collectionName)) {
      (async () => {
        await mongoClient.db(DB).createCollection(collectionName);
      })();
    }
  }
} catch (e) {
  console.error("Error creating collections:", e.message);
}
const mongoCollection = mongoClient.db(DB).collection(COLLECTION);
io.adapter(createAdapter(mongoCollection));
io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("join-group", async (group) => {
    if (groupList.includes(group)) {
      socket.join(group);
      console.log(`Socket ${socket.id} joined group ${group}`);

      // CARREGA MENSAGENS ANTIGAS QUANDO O USUÁRIO ENTRA

      const collectionName =
        GROUP_COLLECTION_PREFIX + group.replace(/\s+/g, "_");
      const groupCollection = mongoClient.db(DB).collection(collectionName);
      (async () => {
        const oldMessages = await groupCollection.find().toArray();
      })();
      socket.emit("old-messages", oldMessages);
    } else {
      console.log(
        `Socket ${socket.id} attempted to join unknown group ${group}`
      );
    }
  });

  // desconexão do usário do socket.io.

  socket.on("leave-group", (group) => {
    if (groupList.includes(group)) {
      socket.leave(group);
      console.log(`Socket ${socket.id} left group ${group}`);
    } else {
      console.log(
        `Socket ${socket.id} attempted to leave unknown group ${group}`
      );
    }
  });

  socket.on("send-message", (msg) => {
    if (groupList.includes(msg.group)) {
      const collectionName =
        GROUP_COLLECTION_PREFIX + msg.group.replace(/\s+/g, "_");
      const groupCollection = mongoClient.db(DB).collection(collectionName);
      const messageDocument = {
        group: msg.group,
        username: msg.username,
        message: msg.message,
        timestamp: new Date(),
      };
      groupCollection.insertOne(messageDocument, (err) => {
        if (err) {
          console.error("Error saving message to MongoDB:", err);
          return;
        }
        io.to(msg.group).emit("message", msg);
        console.log(`Message sent to group ${msg.group}: ${msg.message}`);
      });
    } else {
      console.error("Message sent to unknown group:", msg.group);
    }
  });
});

let userList = new Map();

io.on("connection", (socket) => {
  let userName = socket.handshake.query.userName;
  addUser(userName, socket.id);

  socket.broadcast.emit("user-list", [...userList.keys()]);
  socket.emit("user-list", [...userList.keys()]);

  socket.on("message", async (msg) => {
    try {
      const newMessage = new Message({
        group: socket.group,
        text: msg.text,
        sender: msg.sender,
        timestamp: new Date(),
      });
      (async () => {
        await newMessage.save();
      })();

      //mostra a mensagem enviada para outros usários.
      socket.broadcast.emit("message-broadcast", {
        message: msg.text,
        userName: msg.sender,
      });
    } catch (error) {
      console.error("Error saving message to database:", error);
    }
  });
  socket.on("disconnect", (reason) => {
    removeUser(userName, socket.id);
  });
});

function addUser(userName, id) {
  if (!userList.has(userName)) {
    userList.set(userName, new Set([id]));
  } else {
    userList.get(userName).add(id);
  }
}

function removeUser(userName, id) {
  if (userList.has(userName)) {
    let userIds = userList.get(userName);
    userIds.delete(id);
    if (userIds.size == 0) {
      userList.delete(userName);
    }
  }
}

server.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on port", process.env.PORT || 3000);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).send({ error: err.message });
});
