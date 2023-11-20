import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { CaratController } from './carat.controller';
import { CaratValidation } from './carat.validation';

const router = express.Router();

router.post(
  '/create-carat',
  validateRequest(CaratValidation.createCaratZodSchema),
  auth(ENUM_USER_ROLE.ADMIN),
  CaratController.createCarat,
);

router.get(
  '/:storeId',
  auth(ENUM_USER_ROLE.ADMIN),
  CaratController.getAllCarats,
);

router.get(
  '/single-carat/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  CaratController.getSingleCarat,
);

router.patch(
  '/:id',
  validateRequest(CaratValidation.updateCaratZodSchema),
  auth(ENUM_USER_ROLE.ADMIN),
  CaratController.updateCarat,
);

router.delete('/:id', auth(ENUM_USER_ROLE.ADMIN), CaratController.deleteCarat);

export const CaratRoutes = router;
