import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { NotificationService } from './service';

const getAllNotifications = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  const query = req.query;

  const result = await NotificationService.getAllNotifications(user, query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notifications retrieved successfully.',
    meta: result.meta,
    data: result.data,
  });
});

const updateNotification = catchAsync(async (req: Request, res: Response) => {
  const notificationId = req.params.id;

  const result = await NotificationService.updateNotification(notificationId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notification updated successfully.',
    data: result,
  });
});

export const NotificationController = {
  getAllNotifications,
  updateNotification,
};
