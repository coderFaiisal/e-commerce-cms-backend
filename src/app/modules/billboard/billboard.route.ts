import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { BillboardController } from './billboard.controller';
import { BillboardValidation } from './billboard.validation';

const router = express.Router();

router.post(
  '/create-billboard',
  validateRequest(BillboardValidation.createBillboardZodSchema),
  BillboardController.createBillboard,
);

router.get('/:storeId', BillboardController.getAllBillboards);

router.get('/single-billboard/:id', BillboardController.getSingleBillboard);

router.patch(
  '/:id',
  validateRequest(BillboardValidation.updateBillboardZodSchema),
  BillboardController.updateBillboard,
);

router.delete('/:id', BillboardController.deleteBillboard);

export const BillboardRoutes = router;
