import express from 'express';
import { UserController } from './controller';

const router = express.Router();

const {
  signIn,
  signUp,
  createAdmin,
  accessToken,
  changePassword,
  forgotPassword,
  resetPassword,
  getAllUsers,
  getAllStoreOwners,
  getAllAdmins,
  getProfile,
  getSingleUser,
  updateProfile,
  deleteAccount,
} = UserController;

router.post('/sign-in', signIn);

router.post('/sign-up', signUp);

router.post('/create-admin', createAdmin);

router.post('/access-token', accessToken);

router.post('/change-password', changePassword);

router.post('/forgot-password', forgotPassword);

router.post('/reset-password', resetPassword);

router.get('/all-users', getAllUsers);

router.get('/all-store-owners', getAllStoreOwners);

router.get('/all-admins', getAllAdmins);

router.get('/my-profile', getProfile);

router.get('/:id', getSingleUser);

router.patch('/my-profile', updateProfile);

router.delete('/:id', deleteAccount);

export const UserRoutes = router;
