import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { PaymentService } from './service';

const initSubscriptionPayment = catchAsync(
  async (req: Request, res: Response) => {
    const paymentData = req.body;

    const result = await PaymentService.initSubscriptionPayment(paymentData);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Payment init successfully.',
      data: result,
    });
  },
);

const initOrderPayment = catchAsync(async (req: Request, res: Response) => {
  const paymentData = req.body;

  const result = await PaymentService.initOrderPayment(paymentData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment init successfully.',
    data: result,
  });
});

const validatePayment = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;

  const result = await PaymentService.validatePayment(query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment validated successfully.',
    data: result,
  });
});

export const PaymentController = {
  initSubscriptionPayment,
  initOrderPayment,
  validatePayment,
};
