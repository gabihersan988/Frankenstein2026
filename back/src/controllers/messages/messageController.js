import {
    sendMessageModel,
    getConversationMessagesModel,
    getUserConversationsModel,
} from '../../models/messages/messageModels.js';

export const sendMessageController = async (req, res, next) => {
    try {
        const senderId = req.userId;
        const { receiver_id, message_text } = req.body;

        const message = await sendMessageModel(senderId, receiver_id, message_text);

        res.status(201).send({
            status: 'ok',
            data: message,
            message: 'Mensaje enviado',
        });
    } catch (error) {
        next(error);
    }
};

export const getConversationController = async (req, res, next) => {
    try {
        const userId1 = req.userId;
        const { userId: userId2 } = req.params;

        const messages = await getConversationMessagesModel(userId1, userId2);

        res.send({
            status: 'ok',
            data: messages,
        });
    } catch (error) {
        next(error);
    }
};

export const getConversationsController = async (req, res, next) => {
    try {
        const userId = req.userId;

        const conversations = await getUserConversationsModel(userId);

        res.send({
            status: 'ok',
            data: conversations,
        });
    } catch (error) {
        next(error);
    }
};
