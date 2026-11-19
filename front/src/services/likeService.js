export const toggleProjectLikeService = async ({ projectId, token }) => {
    const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/project/${projectId}/like`,
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
        throw new Error(json.message || 'Error al actualizar Me Gusta');
    }
    return json.data;
};

export const getProjectLikesService = async ({ projectId, token = '' }) => {
    const headers = {};
    if (token) {
        headers.Authorization = token;
    }
    const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/project/${projectId}/likes`,
        {
            headers,
        }
    );
    const json = await response.json();
    if (!response.ok) {
        throw new Error(json.message || 'Error al obtener likes del proyecto');
    }
    return json.data;
};
