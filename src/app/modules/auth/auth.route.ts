import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';

const router = express.Router();

router.post(
  '/signUp',
  validateRequest(AuthValidation.signUpZodSchema),
  AuthController.signUpUser,
);

router.post(
  '/signIn',
  validateRequest(AuthValidation.signInZodSchema),
  AuthController.signInUser,
);

router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenZodSchema),
  AuthController.refreshToken,
);

export const AuthRoutes = router;
