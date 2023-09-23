const express = require('express');
const controllers = require('./controllers');
const messageController = require('./messageController');
const { messageSchema } = require('./validationSchemas');


const router = express.Router();

router.get('/uploads/:filename', controllers.serveFiles);
router.get('/', controllers.rootRoute);
router.post('/upload', controllers.uploadFile);

router.post('/messages', messageSchema, messageController.postMessage);

router.get('/messages', messageController.getMessages);

// Rota para recuperar mensagens de um grupo específico
router.get('/messages/:group', messageController.getMessagesByGroup);

// Rota para atualizar uma mensagem específica
router.put('/message/:id', messageController.updateMessage);

module.exports = router;
