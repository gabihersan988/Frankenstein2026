import express from 'express';
import { registerNewUserController } from '../controllers/users/registerNewUserController.js';
import { loginUserController } from '../controllers/users/loginUserController.js';
import forgotPasswordController from '../controllers/users/forgotPasswordController.js';
import getResetPasswordController from '../controllers/users/getResetPasswordController.js';
import updatePasswordController from '../controllers/users/updatePasswordController.js';
import { profileInsertController } from '../controllers/profile/profileInsertController.js';
import authUser from '../middlewares/auth.js';
import { profileGetController } from '../controllers/profile/profileGetController.js';
import { updateProfileController } from '../controllers/profile/profileUpdateController.js';
import { validateUserController } from '../controllers/users/validateUserController.js';
import { updateValidateCompanyController } from '../controllers/profile/updateValidateCompanyController.js';
//* get info user for React Context:
import { getMeController } from '../controllers/users/getMeController.js';
import { deleteRejectProfileCompanyController } from '../controllers/profile/deleteRejectProfileCompanyController.js';
import authOptional from '../middlewares/authOptional.js';
import {
    toggleFollowController,
    getFollowStatusController,
    getUserConnectionsController,
} from '../controllers/social/followController.js';

const router = express.Router();

router.post('/register', registerNewUserController);

router.post('/login', loginUserController);

//* get info user for React Context:
router.get('/user', authUser, getMeController);

router.post('/myprofile', authUser, profileInsertController);

router.get('/profile/:id', profileGetController);
router.put('/profileupdate', authUser, updateProfileController);

// Rutas de seguimiento y conexiones sociales
router.post('/users/:id/follow', authUser, toggleFollowController);
router.get('/users/:id/follow-status', authOptional, getFollowStatusController);
router.get('/users/:id/connections', getUserConnectionsController);

// Explorar miembros de la comunidad
router.get('/community', authOptional, async (req, res, next) => {
    try {
        const { getCommunityMembersModel } = await import('../models/social/communityModels.js');
        const members = await getCommunityMembersModel(req.userId || null);
        res.send({ status: 'ok', data: members });
    } catch (err) {
        next(err);
    }
});

router.get('/forgot-password', (req, res, next) => {
    res.render('forgot-password');
});
router.post('/forgot-password', forgotPasswordController);

router.get('/reset-password/:id/:token', getResetPasswordController);

router.post('/reset-password/:id/:token', updatePasswordController);
router.get('/validate/:registrationCode', validateUserController);
router.get('/admin/validate/:id', updateValidateCompanyController);
router.delete('/admin/reject/:id', deleteRejectProfileCompanyController);

export default router;
