import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { OrderController } from './order.controller';
import { OrderValidation } from './order.validation';

const router = express.Router();

router.post(
  '/create-order',
  auth(ENUM_USER_ROLE.USER),
  validateRequest(OrderValidation.createOrderZodSchema),
  OrderController.createOrder,
);

router.get(
  '/:storeId',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  OrderController.getAllOrders,
);

router.get(
  '/single-order/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  OrderController.getSingleOrder,
);

router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  OrderController.updateOrder,
);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  OrderController.deleteOrder,
);

export const OrderRoutes = router;
