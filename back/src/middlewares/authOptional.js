import jwt from 'jsonwebtoken';

const authOptional = (req, res, next) => {
    try {
        const { authorization } = req.headers;
        if (authorization && authorization !== 'null' && authorization !== 'undefined') {
            try {
                const token = jwt.verify(authorization, process.env.SECRET);
                req.userId = token.id;
            } catch {
                // Si el token es inválido, continuar como usuario anónimo
            }
        }
        next();
    } catch (error) {
        next(error);
    }
};

export default authOptional;
