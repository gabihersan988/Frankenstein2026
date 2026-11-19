import {
    toggleFollowModel,
    getFollowStatusModel,
    getUserConnectionsModel,
} from '../../models/social/followModels.js';

export const toggleFollowController = async (req, res, next) => {
    try {
        const { id: followingId } = req.params;
        const followerId = req.userId;

        const result = await toggleFollowModel(followerId, followingId);

        res.send({
            status: 'ok',
            data: result,
            message: result.isFollowing
                ? 'Ahora sigues a este usuario'
                : 'Has dejado de seguir a este usuario',
        });
    } catch (error) {
        next(error);
    }
};

export const getFollowStatusController = async (req, res, next) => {
    try {
        const { id: targetUserId } = req.params;
        const currentUserId = req.userId || null;

        const result = await getFollowStatusModel(targetUserId, currentUserId);

        res.send({
            status: 'ok',
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const getUserConnectionsController = async (req, res, next) => {
    try {
        const { id: targetUserId } = req.params;

        const result = await getUserConnectionsModel(targetUserId);

        res.send({
            status: 'ok',
            data: result,
        });
    } catch (error) {
        next(error);
    }
};
