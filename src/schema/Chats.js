const db = require('../config/db');

async function createChatRoom({ userAId, userBId, type = 'individual' }) {
  return db.transaction(async function(trx) {
    const [chatId] = await trx('chat_rooms').insert({ type });

    await trx('chat_members').insert([
      { chatId, userId: userAId },
      { chatId, userId: userBId }
    ]);

    return chatId;
  });
}

async function findExistingChat(userAId, userBId) {
  return db('chat_rooms as cr')
    .join('chat_members as memberA', 'cr.chatId', 'memberA.chatId')
    .join('chat_members as memberB', 'cr.chatId', 'memberB.chatId')
    .where('cr.type', 'individual')
    .where('memberA.userId', userAId)
    .where('memberB.userId', userBId)
    .first('cr.chatId', 'cr.type', 'cr.createAt');
}  

async function isChatMember(chatId, userId) {
  return db('chat_members')
    .where({ chatId, userId })
    .first('chatId')
}

async function getUserChats(userId) {

  return db('chat_members as cm')
    .where('cm.userId', userId)
    .select('cm.chatId')
    .then(chatIds => {
      const chatIdList = chatIds.map(chat => chat.chatId);
      return db('chat_members as cm')
        .join('chat_rooms as cr', 'cm.chatId', 'cr.chatId')
        .whereIn('cm.chatId', chatIdList)
        .groupBy('cm.chatId') 
        .select('cm.chatId', 'cr.type', 'cr.createAt', db.raw('GROUP_CONCAT(cm.userId) as memberIds'))
        .then(members => {
          members.map(member => {
            member.memberIds = member.memberIds.split(',').map(id => parseInt(id));
          });
          return members;
        });
    })
    .catch(err => {
      console.error("Error fetching members:", err);
    });
}

module.exports = { findExistingChat, createChatRoom, getUserChats, isChatMember };
