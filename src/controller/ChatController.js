const Users = require('../schema/Users');
const Chats = require('../schema/Chats');
const Messages = require('../schema/Messages');
const responseUtils = require('../utils/response');

class ChatController {

    async createChat(reqBody, res) {
        const userAId = Number(reqBody.userAId);
        const userBId = Number(reqBody.userBId);
        if (!Number.isInteger(userAId) || userAId <= 0 ||
            !Number.isInteger(userBId) || userBId <= 0 ||
            userAId === userBId
        ) {
            return responseUtils.errorResponse(res, 400, "Invalid or Same user Id passed");
        }

        const userA = await Users.findById(userAId);
        const userB = await Users.findById(userBId);

        if(!userA) {
            await Users.insert({ id: userAId, name: `User ${userAId}`, email: `user${userAId}@example.com` });
        }

        if(!userB) {
            await Users.insert({ id: userBId, name: `User ${userBId}`, email: `user${userBId}@example.com` });
        }

        const existingChat = await Chats.findExistingChat(userAId, userBId);
        if (existingChat) {
            return responseUtils.successResponse(res, {chatId: existingChat.chatId});
        }
        
        const chat = {
            userAId,
            userBId,
            type: 'individual'
        };

        const chatId = await Chats.createChatRoom(chat);
        return responseUtils.successResponse(res, {chatId});
    }

    async getUserChats(userId, res) {
        const userIdNum = Number(userId);
        if (!Number.isInteger(userIdNum) || userIdNum <= 0) {
            return responseUtils.errorResponse(res, 400, "A valid user ID is required");
        }

        const user = await Users.findById(userIdNum);
        if(!user) {
            return responseUtils.errorResponse(res, 404, "User not found");
        }

        const chats = await Chats.getUserChats(userIdNum);
        return responseUtils.successResponse(res, {chats});
    }   

    async sendMessage(chatId, reqBody, res) {
        const chatIdNum = Number(chatId);
        const senderId = Number(reqBody.senderId);
        const text = reqBody.text.trim();

        if (!Number.isInteger(chatIdNum) || chatIdNum <= 0 ||
            !Number.isInteger(senderId) || senderId <= 0 || !text
        ) {
            return responseUtils.errorResponse(res, 400, 'Chat id, sender id and text is required');
        }

        const isMember = await Chats.isChatMember(chatIdNum, senderId);

        if (!isMember) {
            return responseUtils.errorResponse(res, 403, 'Sender is not a member of this chat');
        }

        const message = await Messages.sendMessage(chatIdNum, senderId, text);
        return responseUtils.successResponse(res, message, 'Message sent successfully');
    }

    async getMessages(chatId, limit, res) {
        const chatIdNum = Number(chatId);
        const limitNum = Number(limit);

        if (!Number.isInteger(chatIdNum) || chatIdNum <= 0 ||
            !Number.isInteger(limitNum) || limitNum <= 0
        ) {
            return responseUtils.errorResponse(res, 400, 'Invalid chat Id or limit passed');
        }

        const messages = await Messages.getMessages(chatIdNum, limitNum);
        return responseUtils.successResponse(res, { messages });
    }

}

module.exports = ChatController;