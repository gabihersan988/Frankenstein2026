import getConnection from '../../db/getConnection.js';
import { generateError } from '../../helpers/generateError.js';

const insertNewRegisterModel = async (
    email,
    hashedPassword,
    registrationCode
) => {
    let connection;
    try {
        connection = await getConnection();
        const [result] = await connection.query(
            `INSERT INTO register (email, register_password, register_code) VALUES (?,?,?)`,
            [email, hashedPassword, registrationCode]
        );
        return result;
    } catch (error) {
        console.error('Error insertNewRegisterModel:', error);
        throw generateError('Problema al guardar el registro en la base de datos', 500);
    }
};

export { insertNewRegisterModel };
