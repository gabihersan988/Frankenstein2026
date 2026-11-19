import getConnection from './getConnection.js';

const migrateSocial = async () => {
    let connection;
    try {
        connection = await getConnection();
        console.log('Creando tablas sociales si no existen...');

        await connection.query(`
            CREATE TABLE IF NOT EXISTS user_follows (
                follow_id INT AUTO_INCREMENT PRIMARY KEY,
                follower_id INT NOT NULL,
                following_id INT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                read_at DATETIME NULL,
                UNIQUE KEY unique_follow (follower_id, following_id),
                CONSTRAINT fk_follow_follower FOREIGN KEY (follower_id) REFERENCES register(register_id) ON DELETE CASCADE,
                CONSTRAINT fk_follow_following FOREIGN KEY (following_id) REFERENCES register(register_id) ON DELETE CASCADE
            )
        `);
        console.log('✓ Tabla user_follows lista');

        await connection.query(`
            CREATE TABLE IF NOT EXISTS project_likes (
                like_id INT AUTO_INCREMENT PRIMARY KEY,
                project_id INT NOT NULL,
                register_id INT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY unique_project_like (project_id, register_id),
                CONSTRAINT fk_like_project FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
                CONSTRAINT fk_like_user FOREIGN KEY (register_id) REFERENCES register(register_id) ON DELETE CASCADE
            )
        `);
        console.log('✓ Tabla project_likes lista');

        console.log('Migración completada con éxito.');
    } catch (error) {
        console.error('Error durante la migración:', error);
    } finally {
        if (connection) connection.release();
        process.exit(0);
    }
};

migrateSocial();
