import getConnection from '../../db/getConnection.js';

export const getCommunityMembersModel = async (currentUserId = null) => {
    const connection = await getConnection();

    const [members] = await connection.query(
        `SELECT 
            r.register_id,
            r.email,
            LEFT(r.email, LOCATE('@', r.email) - 1) as usernameOfRegister,
            p.profile_name,
            p.profile_lastname,
            p.profile_username,
            p.avatar,
            p.profile_role,
            COUNT(DISTINCT prj.project_id) as projects_count,
            COUNT(DISTINCT uf.follow_id) as followers_count
         FROM register r
         LEFT JOIN profile p ON r.register_id = p.register_id
         LEFT JOIN projects prj ON r.register_id = prj.register_id
         LEFT JOIN user_follows uf ON r.register_id = uf.following_id
         WHERE r.register_id != ?
         GROUP BY r.register_id
         ORDER BY followers_count DESC, projects_count DESC
         LIMIT 50`,
        [currentUserId || 0]
    );

    return members;
};
