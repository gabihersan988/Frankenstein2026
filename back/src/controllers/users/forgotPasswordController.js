import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../../helpers/sendEmail.js';
import selectUserByEmailModel from '../../models/users/selectUserByEmailModel.js';

const { SECRET, PORTFRONT } = process.env;

const forgotPasswordController = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).send({
                status: 'error',
                message: 'Debes proporcionar un email válido',
            });
        }

        const user = await selectUserByEmailModel(email);

        if (!user) {
            return res.status(404).send({
                status: 'error',
                message: 'No existe ningún usuario con ese correo electrónico',
            });
        }

        const secret = SECRET + user.register_password;
        const pl = {
            email: user.email,
            id: user.register_id,
        };
        const token = jwt.sign(pl, secret, { expiresIn: '15m' });

        const subject = 'Resetea tu contraseña en Frankenstein';
        const content = `
        <h1>Hemos recibido su petición de reseteo de contraseña</h1>
        <p>Haga click en el enlace para actualizar su contraseña.</p>
        <a href="${PORTFRONT}/reset-password/${user.register_id}/${token}">Recuperar contraseña</a>
        `;

        try {
            await sendEmail(email, subject, content);
        } catch (emailErr) {
            console.warn('Aviso: no se pudo enviar el correo de recuperación:', emailErr.message);
        }

        res.send({
            status: 'ok',
            message: 'Revisa la bandeja de entrada de tu email',
        });
    } catch (err) {
        next(err);
    }
};

export default forgotPasswordController;
