# chatInfinity
README para aplicativo de bate-papo
---

Visão geral:
O aplicativo consiste em um backend (Node.js com Express e Socket.io) e um frontend (Angular). O backend lida com operações de chat em tempo real, conecta-se a um banco de dados MongoDB e fornece endpoints para operações CRUD relacionadas a mensagens de chat. O frontend fornece uma interface de usuário interativa para os usuários se registrarem, selecionarem grupos de bate-papo, visualizarem usuários online, enviarem mensagens e anexarem arquivos.

Processo interno:

1. Configuração do banco de dados (database.js):
     - Usa mongoose para interagir com MongoDB.
     - Define esquemas para usuários e mensagens de chat.
     - Fornece vários modelos baseados em cidades e middleware de autenticação.

2. Controlador de mensagens (messageController.js):
     - Fornece pontos de extremidade para postar, recuperar e atualizar mensagens de bate-papo com base na cidade e no grupo.

3. Configuração do servidor (server.js):
     - Inicializa o servidor expresso, configura rotas e conecta-se ao MongoDB.
     - Integra Socket.io para funcionalidade de chat em tempo real.

Front-end:

1. Serviços:
     - message.service.ts: Lida com operações relacionadas a mensagens.
     - socket.service.ts: gerencia comunicações de soquete em tempo real.

2. Componente de bate-papo (chat.component.html e chat.component.ts):
     - Fornece a interface principal do chat. Permite que os usuários enviem mensagens, selecionem grupos de bate-papo, visualizem usuários online e registrem-se.

3. Componente de grupo de bate-papo (chat-group.component.ts):
     - Fornece uma interface para os usuários selecionarem grupos de bate-papo e carregar mensagens relevantes.

4. Componente da lista de mensagens (message-list.component.html e message-list.component.ts):
     - Exibe mensagens de chat com um layout que diferencia as mensagens enviadas pelo usuário atual e por outros.
  

---

Overview:
Application consists of both a backend (Node.js with Express and Socket.io) and a frontend (Angular). The backend handles real-time chat operations, connects to a MongoDB database, and provides endpoints for CRUD operations related to chat messages. The frontend provides an interactive UI for users to register, select chat groups, view online users, send messages, and attach files.

Backend:

1. Database Setup (database.js):
    - Uses mongoose to interact with MongoDB.
    - Defines schemas for users and chat messages.
    - Provides various city-based models and authentication middleware.

2. Message Controller (messageController.js):
    - Provides endpoints to post, retrieve, update chat messages based on city and group.

3. Server Setup (server.js):
    - Initializes the express server, sets up routes, and connects to MongoDB.
    - Integrates Socket.io for real-time chat functionality.

Frontend:

1. Services:
    - message.service.ts: Handles message-related operations.
    - socket.service.ts: Manages real-time socket communications.

2. Chat Component (chat.component.html & chat.component.ts):
    - Provides the main UI for the chat. Allows users to send messages, select chat groups, view online users, and register.

3. Chat Group Component (chat-group.component.ts):
    - Provides an interface for users to select chat groups and loads relevant messages.

4. Message List Component (message-list.component.html & message-list.component.ts):
    - Displays chat messages with a layout that differentiates between messages sent by the current user and others.
