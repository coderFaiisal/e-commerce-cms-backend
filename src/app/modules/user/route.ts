import express from 'express';
import { USER_ROLE } from '../../../constant/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { UserController } from './controller';
import { UserValidation } from './validation';

const router = express.Router();

const { user, store_owner, admin, super_admin } = USER_ROLE;

const {
  signInSchema,
  signUpSchema,
  accessTokenSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateSchema,
} = UserValidation;

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

router.post('/sign-in', validateRequest(signInSchema), signIn);

router.post('/sign-up', validateRequest(signUpSchema), signUp);

router.post(
  '/create-admin',
  auth(super_admin),
  validateRequest(signUpSchema),
  createAdmin,
);

router.post('/access-token', validateRequest(accessTokenSchema), accessToken);

router.post(
  '/change-password',
  auth(user, store_owner, admin, super_admin),
  validateRequest(changePasswordSchema),
  changePassword,
);

router.post(
  '/forgot-password',
  validateRequest(forgotPasswordSchema),
  forgotPassword,
);

router.post(
  '/reset-password',
  validateRequest(resetPasswordSchema),
  resetPassword,
);

router.get('/all-users', auth(admin, super_admin), getAllUsers);

router.get('/all-store-owners', auth(admin, super_admin), getAllStoreOwners);

router.get('/all-admins', auth(super_admin), getAllAdmins);

router.get(
  '/my-profile',
  auth(user, store_owner, admin, super_admin),
  getProfile,
);

router.get('/:id', auth(admin, super_admin), getSingleUser);

router.patch(
  '/my-profile',
  auth(user, store_owner, admin, super_admin),
  validateRequest(updateSchema),
  updateProfile,
);

router.delete('/:id', auth(admin, super_admin), deleteAccount);

export const UserRoutes = router;
