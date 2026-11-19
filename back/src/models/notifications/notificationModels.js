import getConnection from '../../db/getConnection.js';

export const getNotificationsModel = async (userId) => {
    const connection = await getConnection();

    // Mensajes no leídos agrupados por emisor (con el último mensaje)
    const [unreadMessages] = await connection.query(
        `SELECT 
            m.sender_id,
            COUNT(*) AS unread_messages,
            MAX(m.created_at) AS created_at,
            SUBSTRING_INDEX(
                GROUP_CONCAT(m.message_text ORDER BY m.created_at DESC SEPARATOR '|||'),
                '|||',
                1
            ) AS message_text,
            r.register_id,
            r.email,
            LEFT(r.email, LOCATE('@', r.email) - 1) AS usernameOfRegister,
            p.profile_name,
            p.profile_lastname,
            p.profile_username,
            p.avatar
         FROM messages m
         JOIN register r ON m.sender_id = r.register_id
         LEFT JOIN profile p ON r.register_id = p.register_id
         WHERE m.receiver_id = ? AND m.read_at IS NULL
         GROUP BY m.sender_id, r.register_id, r.email, p.profile_name, p.profile_lastname, p.profile_username, p.avatar
         ORDER BY created_at DESC`,
        [userId]
    );

    // Seguidores recientes (últimos 20)
    const [follows] = await connection.query(
        `SELECT 
            uf.follow_id,
            uf.created_at,
            uf.read_at,
            r.register_id,
            r.email,
            LEFT(r.email, LOCATE('@', r.email) - 1) AS usernameOfRegister,
            p.profile_name,
            p.profile_lastname,
            p.profile_username,
            p.avatar
         FROM user_follows uf
         JOIN register r ON uf.follower_id = r.register_id
         LEFT JOIN profile p ON r.register_id = p.register_id
         WHERE uf.following_id = ?
         ORDER BY uf.created_at DESC
         LIMIT 20`,
        [userId]
    );

    const messageNotifications = unreadMessages.map((row) => ({
        id: `msg-${row.sender_id}`,
        type: 'message',
        unread: true,
        unread_messages: Number(row.unread_messages),
        text: row.message_text,
        created_at: row.created_at,
        actor: {
            register_id: row.register_id,
            email: row.email,
            usernameOfRegister: row.usernameOfRegister,
            profile_name: row.profile_name,
            profile_lastname: row.profile_lastname,
            profile_username: row.profile_username,
            avatar: row.avatar,
        },
    }));

    const followNotifications = follows.map((row) => ({
        id: `follow-${row.follow_id}`,
        follow_id: row.follow_id,
        type: 'follow',
        unread: row.read_at === null,
        text: 'Comenzó a seguirte',
        created_at: row.created_at,
        actor: {
            register_id: row.register_id,
            email: row.email,
            usernameOfRegister: row.usernameOfRegister,
            profile_name: row.profile_name,
            profile_lastname: row.profile_lastname,
            profile_username: row.profile_username,
            avatar: row.avatar,
        },
    }));

    const notifications = [...messageNotifications, ...followNotifications].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    const unreadMessagesCount = messageNotifications.reduce(
        (acc, n) => acc + (n.unread_messages || 1),
        0
    );
    const unreadFollowsCount = followNotifications.filter((n) => n.unread).length;

    return {
        unreadCount: unreadMessagesCount + unreadFollowsCount,
        notifications,
    };
};

export const markNotificationsReadModel = async (userId, { type, followId } = {}) => {
    const connection = await getConnection();

    if (type === 'follow' && followId) {
        await connection.query(
            `UPDATE user_follows SET read_at = CURRENT_TIMESTAMP 
             WHERE follow_id = ? AND following_id = ? AND read_at IS NULL`,
            [followId, userId]
        );
        return;
    }

    // Marcar todos los seguidores nuevos como leídos
    await connection.query(
        `UPDATE user_follows SET read_at = CURRENT_TIMESTAMP 
         WHERE following_id = ? AND read_at IS NULL`,
        [userId]
    );

    // Si se pide marcar todo, también marcamos mensajes recibidos como leídos
    if (!type || type === 'all') {
        await connection.query(
            `UPDATE messages SET read_at = CURRENT_TIMESTAMP 
             WHERE receiver_id = ? AND read_at IS NULL`,
            [userId]
        );
    }
};
