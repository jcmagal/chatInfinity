const mongoose = require("mongoose");

const groupList = [
  "Gerência",
  "Financeiro",
  "Vendas",
  "Compras",
  "Estoque",
  "Recursos Humanos",
  "Geral",
];
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  city: { type: String, required: true },
  group: { type: String, required: true, enum: groupList },
});

const User = mongoose.model("User", userSchema);

const messageSchema = new mongoose.Schema({
  group: { type: String, required: true, enum: groupList, index: true },
  username: { type: String, required: true },
  message: { type: String, required: true },
  hasFile: { type: Boolean, required: true, default: false },
  timestamp: { type: Date, default: Date.now },
});
function authenticateUser(req, res, next) {
  const username = req.body.username;

  User.findOne({ username }, (err, user) => {
    if (err || !user) {
      return res.status(403).send({ error: "User not found" });
    }

    req.user = {
      username: user.username,
      city: user.city,
      group: user.group,
    };

    next();
  });
}

function createCityModel(cityName) {
  return mongoose.model(cityName, messageSchema);
}

const CONAPEPVH = createCityModel("CONAPEPVH");
const Ariquemes = createCityModel("Ariquemes");
const Jaru = createCityModel("Jaru");
const JiParana = createCityModel("JiParana");
const ImpelZL = createCityModel("ImpelZL");

const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017";
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

module.exports = {
  mongoose,
  CONAPEPVH,
  Ariquemes,
  Jaru,
  JiParana,
  ImpelZL,
  groupList,
};


