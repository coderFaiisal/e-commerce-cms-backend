import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';

const router = express.Router();

router.post(
  '/create-user',
  validateRequest(UserValidation.createUserZodSchema),
  UserController.createUser,
);

router.post(
  '/login',
  validateRequest(UserValidation.loginUserZodSchema),
  UserController.loginUser,
);

router.post(
  '/refresh-token',
  validateRequest(UserValidation.refreshTokenZodSchema),
  UserController.refreshToken,
);

export const UserRoutes = router;
