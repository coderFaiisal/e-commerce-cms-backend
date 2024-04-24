import { Schema, Types, model } from 'mongoose';
import { SubscriptionModel, TSubscription, plans } from './type';

const subscriptionSchema = new Schema<TSubscription, SubscriptionModel>(
  {
    plan: { type: String, required: true, default: plans.Basic },
    startTime: { type: Date, required: true, default: Date.now },
    endTime: { type: Date, required: true },
    isActive: { type: Boolean, required: true, default: false },
    isPaid: { type: Boolean, required: true, default: false },
    userId: { type: Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
  },
);

export const Subscription = model<TSubscription, SubscriptionModel>(
  'Subscription',
  subscriptionSchema,
);
