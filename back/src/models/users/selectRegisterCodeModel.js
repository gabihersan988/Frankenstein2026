import getConnection from '../../db/getConnection.js';
import { generateError } from '../../helpers/generateError.js';

const selectRegisterCodeModel = async (registrationCode) => {
    const connection = await getConnection();
    const [rows] = await connection.query(
        `SELECT * FROM register WHERE register_code = ?`,
        [registrationCode]
    );

    if (!rows || rows.length === 0) {
        throw generateError('El usuario no existe o ya ha sido activado', 404);
    }
    return rows[0];
};

export { selectRegisterCodeModel };

