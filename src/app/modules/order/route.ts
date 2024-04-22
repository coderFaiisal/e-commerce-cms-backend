import express from 'express';
import { USER_ROLE } from '../../../constant/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { OrderController } from './controller';
import { OrderValidation } from './validation';

const router = express.Router();

const { user, store_owner } = USER_ROLE;

const { createSchema, updateSchema } = OrderValidation;

const { createOrder, getAllOrders, getSingleOrder, updateOrder, cancelOrder } =
  OrderController;

router.post('/create', auth(user), validateRequest(createSchema), createOrder);

router.get('/:storeId', auth(user, store_owner), getAllOrders);

router.get('/single-order/:id', auth(user, store_owner), getSingleOrder);

router.patch(
  '/update/:id',
  auth(user, store_owner),
  validateRequest(updateSchema),
  updateOrder,
);

router.patch('/cancel/:id', auth(user), cancelOrder);

export const OrderRoutes = router;
