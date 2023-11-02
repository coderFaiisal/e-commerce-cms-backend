import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';

import { AdminController } from './admin.controller';
import { AdminValidation } from './admin.validation';

const router = express.Router();

router.post(
  '/create-admin',
  validateRequest(AdminValidation.createAdminZodSchema),
  AdminController.createAdmin,
);

router.get(
  '/my-profile',
  auth(ENUM_USER_ROLE.ADMIN),
  AdminController.getAdminProfile,
);

router.patch(
  '/my-profile',
  auth(ENUM_USER_ROLE.ADMIN),
  AdminController.updateAdminProfile,
);

export const AdminRoutes = router;
