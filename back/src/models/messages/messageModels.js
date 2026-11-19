import getConnection from '../../db/getConnection.js';
import { generateError } from '../../helpers/generateError.js';

export const sendMessageModel = async (senderId, receiverId, messageText) => {
    if (!messageText || messageText.trim() === '') {
        throw generateError('El mensaje no puede estar vacío', 400);
    }

    if (Number(senderId) === Number(receiverId)) {
        throw generateError('No puedes enviarte un mensaje a ti mismo', 400);
    }

    const connection = await getConnection();

    // Comprobar que el destinatario existe
    const [receiverCheck] = await connection.query(
        'SELECT register_id FROM register WHERE register_id = ?',
        [receiverId]
    );
    if (receiverCheck.length === 0) {
        throw generateError('El usuario destinatario no existe', 404);
    }

    // Insertar el mensaje
    const [result] = await connection.query(
        `INSERT INTO messages (sender_id, receiver_id, message_text) VALUES (?, ?, ?)`,
        [senderId, receiverId, messageText.trim()]
    );

    // Obtener el mensaje recién creado con datos del emisor
    const [msgResult] = await connection.query(
        `SELECT m.message_id, m.sender_id, m.receiver_id, m.message_text, m.created_at, m.read_at,
                p.profile_name, p.profile_lastname, p.avatar
         FROM messages m
         LEFT JOIN profile p ON m.sender_id = p.register_id
         WHERE m.message_id = ?`,
        [result.insertId]
    );

    return msgResult[0];
};

export const getConversationMessagesModel = async (userId1, userId2) => {
    const connection = await getConnection();

    // Marcar como leídos los mensajes que userId2 le envió a userId1
    await connection.query(
        `UPDATE messages SET read_at = CURRENT_TIMESTAMP 
         WHERE sender_id = ? AND receiver_id = ? AND read_at IS NULL`,
        [userId2, userId1]
    );

    // Obtener los mensajes del chat
    const [messages] = await connection.query(
        `SELECT m.message_id, m.sender_id, m.receiver_id, m.message_text, m.created_at, m.read_at,
                p.profile_name, p.profile_lastname, p.avatar
         FROM messages m
         LEFT JOIN profile p ON m.sender_id = p.register_id
         WHERE (m.sender_id = ? AND m.receiver_id = ?) 
            OR (m.sender_id = ? AND m.receiver_id = ?)
         ORDER BY m.created_at ASC`,
        [userId1, userId2, userId2, userId1]
    );

    return messages;
};

export const getUserConversationsModel = async (userId) => {
    const connection = await getConnection();

    // Obtener todas las conversaciones activas del usuario con el último mensaje y no leídos
    const [conversations] = await connection.query(
        `SELECT 
            other_user.register_id,
            other_user.email,
            LEFT(other_user.email, LOCATE('@', other_user.email) - 1) as usernameOfRegister,
            p.profile_name,
            p.profile_lastname,
            p.profile_username,
            p.avatar,
            p.profile_role,
            last_msg.message_text,
            last_msg.created_at as last_message_date,
            last_msg.sender_id as last_sender_id,
            COALESCE(unread.unread_count, 0) as unread_count
         FROM (
            SELECT DISTINCT
                CASE WHEN sender_id = ? THEN receiver_id ELSE sender_id END as other_id
            FROM messages
            WHERE sender_id = ? OR receiver_id = ?
         ) convos
         JOIN register other_user ON convos.other_id = other_user.register_id
         LEFT JOIN profile p ON other_user.register_id = p.register_id
         JOIN messages last_msg ON last_msg.message_id = (
             SELECT m2.message_id 
             FROM messages m2 
             WHERE (m2.sender_id = ? AND m2.receiver_id = convos.other_id)
                OR (m2.sender_id = convos.other_id AND m2.receiver_id = ?)
             ORDER BY m2.created_at DESC 
             LIMIT 1
         )
         LEFT JOIN (
             SELECT sender_id, COUNT(*) as unread_count
             FROM messages
             WHERE receiver_id = ? AND read_at IS NULL
             GROUP BY sender_id
         ) unread ON unread.sender_id = convos.other_id
         ORDER BY last_msg.created_at DESC`,
        [userId, userId, userId, userId, userId, userId]
    );

    return conversations;
};
