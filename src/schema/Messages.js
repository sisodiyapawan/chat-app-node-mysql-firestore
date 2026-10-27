const { db, FieldValue } = require('../config/firebase');

function messagesCollection(chatId) {
  return db.collection('chat_rooms').doc(String(chatId)).collection('messages');
}

async function sendMessage(chatId, senderId, text) {
  const messageRef = messagesCollection(chatId).doc();
  await messageRef.set({
    senderId,
    text,
    timestamp: FieldValue.serverTimestamp()
  });

  return { messageId: messageRef.id };
}

async function getMessages(chatId, limit) {
  const messages = await messagesCollection(chatId)
    .orderBy('timestamp', 'asc')
    .limit(limit)
    .get();

  return messages.docs.map((doc) => {
    const data = doc.data();
    return {
      messageId: doc.id,
      senderId: data.senderId,
      text: data.text,
      timestamp: data.timestamp
    };
  });
}

module.exports = { sendMessage, getMessages };
