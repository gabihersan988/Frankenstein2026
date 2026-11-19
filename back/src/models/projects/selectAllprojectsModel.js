import getConnection from '../../db/getConnection.js';
import { generateError } from '../../helpers/generateError.js';

const selectAllProjectsModel = async () => {
    let connection;
    try {
        connection = await getConnection();
        /* const [result] = await connection.query(`
            SELECT projects.project_id, projects.project_title, projects.project_description, projects.project_photo, projects.project_url, projects.created_at, projects.register_id, register.email FROM projects  LEFT JOIN register ON projects.register_id = register.register_id ORDER BY projects.created_at DESC
        `); */

        const [result] = await connection.query(`
        SELECT projects.project_id, projects.project_title, projects.project_description, 
               projects.project_photo, projects.project_url, projects.created_at, projects.register_id, 
               LEFT(register.email, LOCATE('@', register.email) - 1) AS usernameOfRegister,
               COUNT(DISTINCT project_likes.like_id) AS likes_count
        FROM projects  
        LEFT JOIN register ON projects.register_id = register.register_id 
        LEFT JOIN project_likes ON projects.project_id = project_likes.project_id
        GROUP BY projects.project_id
        ORDER BY projects.created_at DESC
        `);
        // console.log('selectAllProjectsModel, result: ', result);

        return result;
    } catch (error) {
        throw generateError('Error select projects BBDD', 500);
    }
};
export { selectAllProjectsModel };
