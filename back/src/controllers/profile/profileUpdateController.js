import { profileSchema } from '../../schemas/profileSchema .js';
import { updateProfileModel } from '../../models/profile/updateProfileModel.js';
import selectProfileByModel from '../../models/profile/selectProfileByModel.js';
import { zodErrorMap } from '../../helpers/zodError.js';
import { createPathIfNotExists } from '../../helpers/createpath.js';
import sharp from 'sharp';
import url from 'url';
import path from 'node:path';
import { nanoid } from 'nanoid';

const updateProfileController = async (req, res, next) => {
    try {
        const {
            success,
            data: profile,
            error,
        } = profileSchema.safeParse(req.body);
        if (!success) {
            const errors = zodErrorMap(error.issues);
            return res.status(400).send({ error: errors });
        }

        let imageFileName;
        if (req.files && req.files.avatar) {
            const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
            const uploadsDir = path.join(__dirname, '../../../uploads');
            await createPathIfNotExists(uploadsDir);
            const image = sharp(req.files.avatar.data);
            image.resize(300);
            imageFileName = `${nanoid(24)}.jpg`;
            await image.toFile(path.join(uploadsDir, imageFileName));
        }

        const {
            profile_name,
            profile_lastname,
            profile_username,
            birthdate,
            profile_role,
            company_name,
        } = profile;

        await updateProfileModel(
            profile_name,
            profile_lastname,
            profile_username,
            birthdate,
            imageFileName,
            profile_role,
            company_name,
            req.userId
        );

        const updatedProfile = await selectProfileByModel(req.userId);

        res.status(200).send({
            status: 'ok',
            message: 'Perfil actualizado con éxito',
            data: {
                profile: updatedProfile,
            },
        });
    } catch (error) {
        next(error);
    }
};
export { updateProfileController };

