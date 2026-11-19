import express from 'express';
import authUser from '../middlewares/auth.js';
import {
    sendMessageController,
    getConversationController,
    getConversationsController,
} from '../controllers/messages/messageController.js';

const router = express.Router();

router.post('/messages', authUser, sendMessageController);
router.get('/messages/:userId', authUser, getConversationController);
router.get('/conversations', authUser, getConversationsController);

export default router;
