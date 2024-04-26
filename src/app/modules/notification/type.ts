import { Model, Types } from 'mongoose';
import { TUser } from '../user/type';

export type TNotification = {
  title: string;
  message: string;
  status: 'read' | 'unread';
  notificationFor: 'order' | 'subscription';
  userId: Types.ObjectId | TUser;
};

export type NotificationModel = Model<TNotification, Record<string, undefined>>;
