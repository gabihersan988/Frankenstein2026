import getConnection from '../../db/getConnection.js';
import { generateError } from '../../helpers/generateError.js';

const selectRegisterByEmailModel = async (email) => {
    const connection = await getConnection();

    const [userEmail] = await connection.query(
        `SELECT register_id FROM register WHERE email = ?`,
        [email]
    );

    if (userEmail.length > 0) {
        throw generateError('Ya existe un usuario registrado con este correo', 409);
    }
};

export { selectRegisterByEmailModel };
