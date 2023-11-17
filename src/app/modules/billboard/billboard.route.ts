import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { BillboardController } from './billboard.controller';
import { BillboardValidation } from './billboard.validation';

const router = express.Router();

router.post(
  '/create-billboard',
  validateRequest(BillboardValidation.createBillboardZodSchema),
  auth(ENUM_USER_ROLE.ADMIN),
  BillboardController.createBillboard,
);

router.get(
  '/',
  auth(ENUM_USER_ROLE.ADMIN),
  BillboardController.getAllBillboards,
);

router.get(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  BillboardController.getSingleBillboard,
);

router.patch(
  '/:id',
  validateRequest(BillboardValidation.updateBillboardZodSchema),
  auth(ENUM_USER_ROLE.ADMIN),
  BillboardController.updateBillboard,
);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  BillboardController.deleteBillboard,
);

export const BillboardRoutes = router;
