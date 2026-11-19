export const getCommunityMembersService = async ({ token = '' } = {}) => {
    const headers = {};
    if (token) {
        headers.Authorization = token;
    }
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/community`, {
        headers,
    });
    const json = await response.json();
    if (!response.ok) {
        throw new Error(json.message || 'Error al obtener miembros de la comunidad');
    }
    return json.data;
};
