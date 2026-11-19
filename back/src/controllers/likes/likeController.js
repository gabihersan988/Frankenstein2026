import {
    toggleProjectLikeModel,
    getProjectLikesModel,
} from '../../models/likes/likeModels.js';

export const toggleProjectLikeController = async (req, res, next) => {
    try {
        const { id: projectId } = req.params;
        const registerId = req.userId;

        const result = await toggleProjectLikeModel(projectId, registerId);

        res.send({
            status: 'ok',
            data: result,
            message: result.isLiked
                ? '¡Te gusta este proyecto!'
                : 'Ya no te gusta este proyecto',
        });
    } catch (error) {
        next(error);
    }
};

export const getProjectLikesController = async (req, res, next) => {
    try {
        const { id: projectId } = req.params;
        const currentUserId = req.userId || null;

        const result = await getProjectLikesModel(projectId, currentUserId);

        res.send({
            status: 'ok',
            data: result,
        });
    } catch (error) {
        next(error);
    }
};
