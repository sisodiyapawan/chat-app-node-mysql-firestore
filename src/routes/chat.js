var express = require('express');
var router = express.Router();
var ChatController = require('../controller/ChatController');

const chatControllerObj = new ChatController();

router.post('/create', async function(req, res, next) {
  try {
    await chatControllerObj.createChat(req.body, res);
  } catch (error) {
    next(error);
  }
});

router.post('/:chatId/message/send', async function(req, res, next) {
  try {
    await chatControllerObj.sendMessage(req.params.chatId, req.body, res);
  } catch (error) {
    next(error);
  }
});

router.get('/:chatId/messages', async function(req, res, next) {
  try {
    await chatControllerObj.getMessages(req.params.chatId, req.query.limit, res);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
