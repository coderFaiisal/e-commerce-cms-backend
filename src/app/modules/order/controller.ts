import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { OrderService } from './service';

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  const { ...orderData } = req.body;

  const result = await OrderService.createOrder(user, orderData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order create successfully.',
    data: result,
  });
});

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  const storeId = req.params.storeId;

  const query = req.query;

  const result = await OrderService.getAllOrders(user, storeId, query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Orders retrieved successfully.',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleOrder = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  const orderId = req.params.id;

  const result = await OrderService.getSingleOrder(user, orderId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order retrieved successfully.',
    data: result,
  });
});

const updateOrder = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  const orderId = req.params.id;

  const { ...updatedData } = req.body;

  const result = await OrderService.updateOrder(user, orderId, updatedData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order updated successfully.',
    data: result,
  });
});

const cancelOrder = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  const orderId = req.params.id;

  const result = await OrderService.cancelOrder(user, orderId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order canceled successfully.',
    data: result,
  });
});

export const OrderController = {
  createOrder,
  getAllOrders,
  getSingleOrder,
  updateOrder,
  cancelOrder,
};
