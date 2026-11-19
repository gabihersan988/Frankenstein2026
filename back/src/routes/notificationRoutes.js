import express from 'express';
import authUser from '../middlewares/auth.js';
import {
    getNotificationsController,
    markNotificationsReadController,
} from '../controllers/notifications/notificationController.js';

const router = express.Router();

router.get('/notifications', authUser, getNotificationsController);
router.patch('/notifications/read', authUser, markNotificationsReadController);

export default router;
