var express = require('express');
var router = express.Router();
var ChatController = require('../controller/ChatController');

const chatControllerObj = new ChatController();

router.get('/:userId/chats', async function(req, res, next) {
  try {
    await chatControllerObj.getUserChats(req.params.userId, res);
  } catch (error) {
    next(error);
  }
});

module.exports = router;