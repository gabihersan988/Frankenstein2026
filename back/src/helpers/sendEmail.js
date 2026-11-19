import { createTransport } from 'nodemailer';
import 'dotenv/config';

const { SMTP_HOST, SMTP_PASS, SMTP_PORT, SMTP_USER } = process.env;

let transporter = null;
if (SMTP_HOST && SMTP_USER && SMTP_PASS && SMTP_PASS.trim() !== '') {
    try {
        transporter = createTransport({
            host: SMTP_HOST,
            port: Number(SMTP_PORT) || 587,
            auth: {
                user: SMTP_USER,
                pass: SMTP_PASS,
            },
        });
    } catch (err) {
        console.warn('No se pudo inicializar el transporte SMTP:', err.message);
    }
}

async function sendEmail(destination, subject, content) {
    // Si no hay transporte o credenciales configuradas, simular envío en consola
    if (!transporter) {
        console.log('\n==================================================');
        console.log('📧 [MODO DESARROLLO - EMAIL SIMULADO]');
        console.log(`Para: ${destination}`);
        console.log(`Asunto: ${subject}`);
        const linkMatch = content.match(/href="([^"]+)"/);
        if (linkMatch) {
            console.log(`🔗 Enlace de acción: ${linkMatch[1]}`);
        }
        console.log('==================================================\n');
        return { simulated: true };
    }

    try {
        await transporter.sendMail({
            from: `"Frankenstein" <${SMTP_USER}>`,
            to: destination,
            subject: subject,
            html: content,
        });
        console.log(`Email enviado con éxito a ${destination}`);
        return { success: true };
    } catch (error) {
        console.warn(`Aviso: Error enviando email real a ${destination}: ${error.message}`);
        console.log('\n==================================================');
        console.log('📧 [RESPALDO EN CONSOLA POR ERROR SMTP]');
        console.log(`Para: ${destination}`);
        console.log(`Asunto: ${subject}`);
        const linkMatch = content.match(/href="([^"]+)"/);
        if (linkMatch) {
            console.log(`🔗 Enlace de acción: ${linkMatch[1]}`);
        }
        console.log('==================================================\n');
        // No lanzamos error para no tumbar el flujo del usuario en desarrollo
        return { simulated: true, error: error.message };
    }
}

export { sendEmail };

