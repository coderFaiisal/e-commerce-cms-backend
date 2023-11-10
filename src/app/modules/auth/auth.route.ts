import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';

const router = express.Router();

router.post(
  '/sign-up',
  validateRequest(AuthValidation.signUpUserZodSchema),
  AuthController.signUpUser,
);

router.post(
  '/sign-in',
  validateRequest(AuthValidation.signInUserZodSchema),
  AuthController.signInUser,
);

router.post(
  '/change-password',
  auth(ENUM_USER_ROLE.USER),
  validateRequest(AuthValidation.changeUserPasswordZodSchema),
  AuthController.changePassword,
);

router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenZodSchema),
  AuthController.refreshToken,
);

export const AuthRoutes = router;
