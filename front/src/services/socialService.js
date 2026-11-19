export const toggleFollowService = async ({ userId, token }) => {
    const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/users/${userId}/follow`,
        {
            method: 'POST',
            headers: {
                Authorization: token,
                'Content-Type': 'application/json',
            },
        }
    );
    const json = await response.json();
    if (!response.ok) {
        throw new Error(json.message || 'Error al cambiar seguimiento');
    }
    return json.data;
};

export const getFollowStatusService = async ({ userId, token = '' }) => {
    const headers = {};
    if (token) {
        headers.Authorization = token;
    }
    const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/users/${userId}/follow-status`,
        {
            headers,
        }
    );
    const json = await response.json();
    if (!response.ok) {
        throw new Error(json.message || 'Error al obtener estado de seguimiento');
    }
    return json.data;
};

export const getUserConnectionsService = async (userId) => {
    const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/users/${userId}/connections`
    );
    const json = await response.json();
    if (!response.ok) {
        throw new Error(json.message || 'Error al obtener conexiones');
    }
    return json.data;
};
