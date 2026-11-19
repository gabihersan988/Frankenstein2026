import bcrypt from 'bcrypt';
import getConnection from './getConnection.js';

const seed = async () => {
    try {
        const connection = await getConnection();
        console.log('Insertando datos de prueba...');

        const hashedPassword = await bcrypt.hash('Password123!', 10);

        // 1. Insert users
        const [user1] = await connection.query(
            `INSERT INTO register (email, register_password, active) VALUES (?, ?, 1)
             ON DUPLICATE KEY UPDATE active=1`,
            ['dev@frankenstein.com', hashedPassword]
        );
        const user1Id = user1.insertId || 1;

        const [user2] = await connection.query(
            `INSERT INTO register (email, register_password, active) VALUES (?, ?, 1)
             ON DUPLICATE KEY UPDATE active=1`,
            ['creativo@frankenstein.com', hashedPassword]
        );
        const user2Id = user2.insertId || 2;

        // 2. Insert profiles
        await connection.query(
            `INSERT IGNORE INTO profile (profile_name, profile_lastname, profile_username, birthdate, profile_role, register_id, validate)
             VALUES (?, ?, ?, '1995-05-15', 'expert', ?, 1)`,
            ['Víctor', 'Frankenstein', 'vfrankenstein', user1Id]
        );

        await connection.query(
            `INSERT IGNORE INTO profile (profile_name, profile_lastname, profile_username, birthdate, profile_role, register_id, validate)
             VALUES (?, ?, ?, '1998-08-20', 'student', ?, 1)`,
            ['Elena', 'Creativa', 'elenacreativa', user2Id]
        );

        // 3. Insert projects
        await connection.query(
            `INSERT INTO projects (project_title, project_description, project_url, register_id)
             VALUES 
             (?, ?, ?, ?),
             (?, ?, ?, ?)`,
            [
                'Frankenstein Platform Hub',
                'Red social y entorno colaborativo para creativos y desarrolladores. Conecta talentos, expone proyectos y resuelve dudas de programación.',
                'https://github.com/Natilenva/frankenstein',
                user1Id,
                'Neo-Brutalist Design System',
                'Sistema de diseño minimalista con estética moderna, animaciones suaves y soporte de accesibilidad WCAG.',
                'https://dribbble.com',
                user2Id
            ]
        );

        // 4. Insert questions
        const [q1] = await connection.query(
            `INSERT INTO questions (question_title, question_description, technology, user_id)
             VALUES (?, ?, ?, ?)`,
            [
                '¿Cómo estructurar el estado global en React 18 eficientemente?',
                'Estoy comparando React Context con Zustand o Redux Toolkit para una aplicación con flujos de autenticación y datos de usuario en tiempo real. ¿Cuál recomiendan para rendimiento?',
                'React',
                user2Id
            ]
        );

        const [q2] = await connection.query(
            `INSERT INTO questions (question_title, question_description, technology, user_id)
             VALUES (?, ?, ?, ?)`,
            [
                'Mejor práctica para autenticación segura con JWT y cookies HttpOnly en Express',
                '¿Es recomendable guardar el token JWT en localStorage o es más seguro usar cookies HttpOnly con SameSite=Strict en un backend Express separado?',
                'Node.js',
                user1Id
            ]
        );

        // 5. Insert response
        if (q1.insertId) {
            await connection.query(
                `INSERT INTO responses (response_text, register_id, question_id)
                 VALUES (?, ?, ?)`,
                [
                    'Para autenticación y datos simples de sesión, React Context con un Custom Hook es suficiente. Si requieres re-renderizados finos o muchas actualizaciones concurrentes, Zustand es extremadamente ligero y rápido.',
                    user1Id,
                    q1.insertId
                ]
            );
        }

        console.log('¡Datos de prueba insertados con éxito!');
        process.exit(0);
    } catch (err) {
        console.error('Error insertando datos de prueba:', err);
        process.exit(1);
    }
};

seed();
