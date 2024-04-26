import { Schema, model } from 'mongoose';
import { NotificationModel, TNotification } from './type';

const notificationSchema = new Schema<TNotification, NotificationModel>(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['read', 'unread'], default: 'unread' },
    notificationFor: {
      type: String,
      enum: ['order', 'subscription'],
      required: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
  },
);

export const Notification = model<TNotification, NotificationModel>(
  'Notification',
  notificationSchema,
);
