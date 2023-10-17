import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { UserController } from './user.controller';

const router = express.Router();

router.get('/', auth(ENUM_USER_ROLE.ADMIN), UserController.getAllUsers);

router.get(
  '/my-profile',
  auth(ENUM_USER_ROLE.USER),
  UserController.getUserProfile,
);

router.get(
  '/reviews',
  auth(ENUM_USER_ROLE.USER),
  UserController.getUserReviews,
);

router.get('/:id', auth(ENUM_USER_ROLE.ADMIN), UserController.getSingleUser);

router.patch(
  '/my-profile',
  auth(ENUM_USER_ROLE.USER),
  UserController.updateUserProfile,
);

router.delete('/:id', auth(ENUM_USER_ROLE.ADMIN), UserController.deleteUser);

export const UserRoutes = router;
