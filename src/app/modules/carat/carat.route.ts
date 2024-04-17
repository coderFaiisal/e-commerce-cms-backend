import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CaratController } from './carat.controller';
import { CaratValidation } from './carat.validation';

const router = express.Router();

router.post(
  '/create-carat',
  validateRequest(CaratValidation.createCaratZodSchema),
  CaratController.createCarat,
);

router.get('/:storeId', CaratController.getAllCarats);

router.get('/single-carat/:id', CaratController.getSingleCarat);

router.patch(
  '/:id',
  validateRequest(CaratValidation.updateCaratZodSchema),
  CaratController.updateCarat,
);

router.delete('/:id', CaratController.deleteCarat);

export const CaratRoutes = router;
