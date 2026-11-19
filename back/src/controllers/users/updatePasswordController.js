import 'dotenv/config';
import bcrypt from 'bcrypt';
import getConnection from '../../db/getConnection.js';
import selectUserByIdModel from '../../models/users/selectUserById.js';

const updatePasswordController = async (req, res, next) => {
    try {
        const connection = await getConnection();
        const { id } = req.params;

        const user = await selectUserByIdModel(id);
        if (!user) {
            return res.status(404).send({
                status: 'error',
                message: 'Usuario no encontrado',
            });
        }

        const { password, password2 } = req.body;

        if (password !== password2) {
            return res.status(400).send({
                status: 'error',
                message: 'Las contraseñas no coinciden',
            });
        }

        const saltRounds = 10;
        const hashedPassword = bcrypt.hashSync(password, saltRounds);

        await connection.query(
            `UPDATE register SET register_password = ? WHERE register_id = ?`,
            [hashedPassword, id]
        );

        res.send({
            status: 'ok',
            message: 'Contraseña actualizada con éxito',
        });
    } catch (err) {
        next(err);
    }
};

export default updatePasswordController;
