export const sendMessageService = async ({ receiverId, messageText, token }) => {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/messages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: token,
        },
        body: JSON.stringify({
            receiver_id: receiverId,
            message_text: messageText,
        }),
    });
    const json = await response.json();
    if (!response.ok) {
        throw new Error(json.message || 'Error al enviar mensaje');
    }
    return json.data;
};

export const getConversationService = async ({ userId, token }) => {
    const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/messages/${userId}`,
        {
            headers: {
                Authorization: token,
            },
        }
    );
    const json = await response.json();
    if (!response.ok) {
        throw new Error(json.message || 'Error al cargar mensajes');
    }
    return json.data;
};

export const getConversationsService = async ({ token }) => {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/conversations`, {
        headers: {
            Authorization: token,
        },
    });
    const json = await response.json();
    if (!response.ok) {
        throw new Error(json.message || 'Error al cargar conversaciones');
    }
    return json.data;
};
