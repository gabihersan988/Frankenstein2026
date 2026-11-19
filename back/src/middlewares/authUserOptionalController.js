import jwt from 'jsonwebtoken';

const {SECRET}= process.env;

const authUserOptionalController= async(req, res, next)=>{
    try {
        const {authorization}= req.headers;

        if (authorization && authorization !== 'null' && authorization !== 'undefined') {
            try {
                const token = jwt.verify(authorization, SECRET);
                req.user = token;
            } catch {
                // Token opcional no válido, se ignora silenciosamente
            }
        }
        next()
        
    } catch (err) {
        next(err)
    }
};

export default authUserOptionalController;