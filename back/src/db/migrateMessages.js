import getConnection from './getConnection.js';

const migrateMessages = async () => {
    try {
        const connection = await getConnection();
        await connection.query(`
            CREATE TABLE IF NOT EXISTS messages (
                message_id INT AUTO_INCREMENT PRIMARY KEY,
                sender_id INT NOT NULL,
                receiver_id INT NOT NULL,
                message_text TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                read_at DATETIME NULL,
                CONSTRAINT fk_msg_sender FOREIGN KEY (sender_id) REFERENCES register(register_id) ON DELETE CASCADE,
                CONSTRAINT fk_msg_receiver FOREIGN KEY (receiver_id) REFERENCES register(register_id) ON DELETE CASCADE
            )
        `);
        console.log('✓ Tabla messages creada correctamente');
        process.exit(0);
    } catch (err) {
        console.error('Error al crear tabla messages:', err);
        process.exit(1);
    }
};

migrateMessages();
