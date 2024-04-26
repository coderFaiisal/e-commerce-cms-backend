/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-expressions */
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import QueryBuilder from '../../builder/QueryBuilder';
import { Notification } from './model';

const getAllNotifications = async (
  user: JwtPayload | null,
  query: Record<string, unknown>,
) => {
  let notificationQuery: any;

  if (user?.role === 'store_owner') {
    notificationQuery = new QueryBuilder(
      Notification.find({ notificationFor: 'order' }),
      query,
    )
      .search(['title'])
      .filter()
      .sort()
      .paginate()
      .fields();
  }

  if (user?.role === 'admin') {
    notificationQuery = new QueryBuilder(
      Notification.find({ notificationFor: 'subscription' }),
      query,
    )
      .search(['title'])
      .filter()
      .sort()
      .paginate()
      .fields();
  }

  const result = await notificationQuery.modelQuery;
  const { page, limit, total } = await notificationQuery.countTotal();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const updateNotification = async (notificationId: string) => {
  const isNotificationExist = await Notification.findById(notificationId);

  if (!isNotificationExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Notification doesn't exist!");
  }

  isNotificationExist.status
    ? (isNotificationExist.status = 'read')
    : isNotificationExist.status;

  await isNotificationExist.save();

  return true;
};

export const NotificationService = {
  getAllNotifications,
  updateNotification,
};
