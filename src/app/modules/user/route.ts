import express from 'express';
import { UserController } from './controller';

const router = express.Router();

router.post('/sign-in', UserController.signIn);

router.post('/sign-up', UserController.signUp);

router.post('/create-admin', UserController.createAdmin);

router.post('/access-token', UserController.accessToken);

router.post('/change-password', UserController.changePassword);

//! Work from here

router.post('/forgot-password', UserController.forgotPassword);

router.post('/reset-password', UserController.resetPassword);

router.get('/all-users', UserController.getAllUsers);

router.get('/all-store-owners', UserController.getAllStoreOwners);

router.get('/all-admins', UserController.getAllAdmins);

router.get('/my-profile', UserController.getProfile);

router.get('/:id', UserController.getSingleUser);

router.patch('/my-profile', UserController.updateProfile);

router.delete('/:id', UserController.deleteAccount);

export const UserRoutes = router;
