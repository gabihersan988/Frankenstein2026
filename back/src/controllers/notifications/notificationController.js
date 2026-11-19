import {
    getNotificationsModel,
    markNotificationsReadModel,
} from '../../models/notifications/notificationModels.js';

export const getNotificationsController = async (req, res, next) => {
    try {
        const data = await getNotificationsModel(req.userId);
        res.send({
            status: 'ok',
            data,
        });
    } catch (error) {
        next(error);
    }
};

export const markNotificationsReadController = async (req, res, next) => {
    try {
        const { type, followId } = req.body || {};
        await markNotificationsReadModel(req.userId, { type, followId });
        res.send({
            status: 'ok',
            message: 'Notificaciones marcadas como leídas',
        });
    } catch (error) {
        next(error);
    }
};
