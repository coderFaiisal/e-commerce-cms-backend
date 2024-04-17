import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { OrderController } from './order.controller';
import { OrderValidation } from './order.validation';

const router = express.Router();

router.post(
  '/create-order',
  validateRequest(OrderValidation.createOrderZodSchema),
  OrderController.createOrder,
);

router.get('/:storeId', OrderController.getAllOrders);

router.get('/single-order/:id', OrderController.getSingleOrder);

router.patch('/:id', OrderController.updateOrder);

router.delete('/:id', OrderController.deleteOrder);

export const OrderRoutes = router;
