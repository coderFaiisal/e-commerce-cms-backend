import express from 'express';
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
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenZodSchema),
  AuthController.refreshToken,
);

export const AuthRoutes = router;
