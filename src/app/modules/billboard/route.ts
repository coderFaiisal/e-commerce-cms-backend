import express from 'express';
import { USER_ROLE } from '../../../constant/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { BillboardController } from './controller';
import { BillboardValidation } from './validation';

const router = express.Router();

const { store_owner } = USER_ROLE;

const { createSchema, updateSchema } = BillboardValidation;

const {
  createBillboard,
  getAllBillboards,
  getSingleBillboard,
  updateBillboard,
  deleteBillboard,
} = BillboardController;

router.post(
  '/create',
  auth(store_owner),
  validateRequest(createSchema),
  createBillboard,
);

router.get('/:storeId', getAllBillboards);

router.get('/single-billboard/:id', getSingleBillboard);

router.patch(
  '/:id',
  auth(store_owner),
  validateRequest(updateSchema),
  updateBillboard,
);

router.delete('/:id', auth(store_owner), deleteBillboard);

export const BillboardRoutes = router;
