import getConnection from '../../db/getConnection.js';
import { generateError } from '../../helpers/generateError.js';

export const toggleProjectLikeModel = async (projectId, registerId) => {
    const connection = await getConnection();

    // Comprobar que el proyecto existe
    const [projectCheck] = await connection.query(
        'SELECT project_id FROM projects WHERE project_id = ?',
        [projectId]
    );
    if (projectCheck.length === 0) {
        throw generateError('El proyecto no existe', 404);
    }

    // Comprobar si ya le ha dado like
    const [existing] = await connection.query(
        'SELECT like_id FROM project_likes WHERE project_id = ? AND register_id = ?',
        [projectId, registerId]
    );

    let isLiked = false;
    if (existing.length > 0) {
        await connection.query(
            'DELETE FROM project_likes WHERE project_id = ? AND register_id = ?',
            [projectId, registerId]
        );
        isLiked = false;
    } else {
        await connection.query(
            'INSERT INTO project_likes (project_id, register_id) VALUES (?, ?)',
            [projectId, registerId]
        );
        isLiked = true;
    }

    // Contar likes totales del proyecto
    const [countResult] = await connection.query(
        'SELECT COUNT(*) as count FROM project_likes WHERE project_id = ?',
        [projectId]
    );

    return {
        isLiked,
        likesCount: countResult[0].count,
    };
};

export const getProjectLikesModel = async (projectId, currentUserId = null) => {
    const connection = await getConnection();

    const [countResult] = await connection.query(
        'SELECT COUNT(*) as count FROM project_likes WHERE project_id = ?',
        [projectId]
    );

    let isLiked = false;
    if (currentUserId) {
        const [likeCheck] = await connection.query(
            'SELECT like_id FROM project_likes WHERE project_id = ? AND register_id = ?',
            [projectId, currentUserId]
        );
        isLiked = likeCheck.length > 0;
    }

    return {
        likesCount: countResult[0].count,
        isLiked,
    };
};
