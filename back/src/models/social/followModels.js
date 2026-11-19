import getConnection from '../../db/getConnection.js';
import { generateError } from '../../helpers/generateError.js';

export const toggleFollowModel = async (followerId, followingId) => {
    if (Number(followerId) === Number(followingId)) {
        throw generateError('No puedes seguirte a ti mismo', 400);
    }

    const connection = await getConnection();

    // Comprobar si ya existe el seguimiento
    const [existing] = await connection.query(
        'SELECT follow_id FROM user_follows WHERE follower_id = ? AND following_id = ?',
        [followerId, followingId]
    );

    let isFollowing = false;
    if (existing.length > 0) {
        // Dejar de seguir
        await connection.query(
            'DELETE FROM user_follows WHERE follower_id = ? AND following_id = ?',
            [followerId, followingId]
        );
        isFollowing = false;
    } else {
        // Seguir
        await connection.query(
            'INSERT INTO user_follows (follower_id, following_id) VALUES (?, ?)',
            [followerId, followingId]
        );
        isFollowing = true;
    }

    // Comprobar si ahora son amigos mutuos
    const [mutualCheck] = await connection.query(
        'SELECT follow_id FROM user_follows WHERE follower_id = ? AND following_id = ?',
        [followingId, followerId]
    );
    const isMutual = isFollowing && mutualCheck.length > 0;

    // Obtener contadores actualizados de followingId
    const [followersResult] = await connection.query(
        'SELECT COUNT(*) as count FROM user_follows WHERE following_id = ?',
        [followingId]
    );
    const [followingResult] = await connection.query(
        'SELECT COUNT(*) as count FROM user_follows WHERE follower_id = ?',
        [followingId]
    );

    return {
        isFollowing,
        isMutual,
        followersCount: followersResult[0].count,
        followingCount: followingResult[0].count,
    };
};

export const getFollowStatusModel = async (targetUserId, currentUserId = null) => {
    const connection = await getConnection();

    // Contar seguidores de targetUserId
    const [followersResult] = await connection.query(
        'SELECT COUNT(*) as count FROM user_follows WHERE following_id = ?',
        [targetUserId]
    );

    // Contar a cuántos sigue targetUserId
    const [followingResult] = await connection.query(
        'SELECT COUNT(*) as count FROM user_follows WHERE follower_id = ?',
        [targetUserId]
    );

    // Contar conexiones mutuas (amigos) de targetUserId
    const [friendsResult] = await connection.query(
        `SELECT COUNT(*) as count 
         FROM user_follows uf1 
         JOIN user_follows uf2 ON uf1.follower_id = uf2.following_id AND uf1.following_id = uf2.follower_id 
         WHERE uf1.follower_id = ?`,
        [targetUserId]
    );

    let isFollowing = false;
    let isFollower = false;

    if (currentUserId && Number(currentUserId) !== Number(targetUserId)) {
        const [followingCheck] = await connection.query(
            'SELECT follow_id FROM user_follows WHERE follower_id = ? AND following_id = ?',
            [currentUserId, targetUserId]
        );
        isFollowing = followingCheck.length > 0;

        const [followerCheck] = await connection.query(
            'SELECT follow_id FROM user_follows WHERE follower_id = ? AND following_id = ?',
            [targetUserId, currentUserId]
        );
        isFollower = followerCheck.length > 0;
    }

    return {
        followersCount: followersResult[0].count,
        followingCount: followingResult[0].count,
        friendsCount: friendsResult[0].count,
        isFollowing,
        isFollower,
        isMutual: isFollowing && isFollower,
    };
};

export const getUserConnectionsModel = async (targetUserId) => {
    const connection = await getConnection();

    // Seguidores
    const [followers] = await connection.query(
        `SELECT uf.created_at as connected_at, r.register_id, r.email, 
                LEFT(r.email, LOCATE('@', r.email) - 1) as usernameOfRegister,
                p.profile_name, p.profile_lastname, p.profile_username, p.avatar, p.profile_role
         FROM user_follows uf
         JOIN register r ON uf.follower_id = r.register_id
         LEFT JOIN profile p ON r.register_id = p.register_id
         WHERE uf.following_id = ?
         ORDER BY uf.created_at DESC`,
        [targetUserId]
    );

    // Siguiendo
    const [following] = await connection.query(
        `SELECT uf.created_at as connected_at, r.register_id, r.email, 
                LEFT(r.email, LOCATE('@', r.email) - 1) as usernameOfRegister,
                p.profile_name, p.profile_lastname, p.profile_username, p.avatar, p.profile_role
         FROM user_follows uf
         JOIN register r ON uf.following_id = r.register_id
         LEFT JOIN profile p ON r.register_id = p.register_id
         WHERE uf.follower_id = ?
         ORDER BY uf.created_at DESC`,
        [targetUserId]
    );

    // Amigos mutuos
    const [friends] = await connection.query(
        `SELECT uf1.created_at as connected_at, r.register_id, r.email, 
                LEFT(r.email, LOCATE('@', r.email) - 1) as usernameOfRegister,
                p.profile_name, p.profile_lastname, p.profile_username, p.avatar, p.profile_role
         FROM user_follows uf1
         JOIN user_follows uf2 ON uf1.follower_id = uf2.following_id AND uf1.following_id = uf2.follower_id
         JOIN register r ON uf1.following_id = r.register_id
         LEFT JOIN profile p ON r.register_id = p.register_id
         WHERE uf1.follower_id = ?
         ORDER BY uf1.created_at DESC`,
        [targetUserId]
    );

    return {
        followers,
        following,
        friends,
    };
};
