import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { SubscriptionService } from './service';

const createSubscription = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  const subscriptionData = req.body;

  const result = await SubscriptionService.createSubscription(
    user,
    subscriptionData,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Subscription created successfully.',
    data: result,
  });
});

const getSingleSubscription = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await SubscriptionService.getSingleSubscription(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Subscription retrieved successfully.',
      data: result,
    });
  },
);

const renewOrUpgradeSubscription = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const { ...updatedData } = req.body;

    const result = await SubscriptionService.renewOrUpgradeSubscription(
      id,
      updatedData,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Subscription updated successfully.',
      data: result,
    });
  },
);

const cancelSubscription = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await SubscriptionService.cancelSubscription(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Subscription canceled successfully.',
    data: result,
  });
});

export const SubscriptionController = {
  createSubscription,
  getSingleSubscription,
  renewOrUpgradeSubscription,
  cancelSubscription,
};
