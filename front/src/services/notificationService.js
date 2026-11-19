export const getNotificationsService = async ({ token }) => {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/notifications`, {
        headers: {
            Authorization: token,
        },
    });
    const json = await response.json();
    if (!response.ok) {
        throw new Error(json.message || 'Error al cargar notificaciones');
    }
    return json.data;
};

export const markNotificationsReadService = async ({ token, type = 'all', followId } = {}) => {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/notifications/read`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: token,
        },
        body: JSON.stringify({ type, followId }),
    });
    const json = await response.json();
    if (!response.ok) {
        throw new Error(json.message || 'Error al marcar notificaciones');
    }
    return json;
};
