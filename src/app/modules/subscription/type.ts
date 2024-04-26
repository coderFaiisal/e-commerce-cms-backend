import { Model } from 'mongoose';
import { TUser } from '../user/type';

/* eslint-disable no-unused-vars */
export enum plans {
  Basic = 'basic',
  Pro = 'pro',
  Enterprise = 'enterprise',
}

export type TSubscription = {
  plan: plans;
  startTime: Date;
  endTime: Date;
  isActive: boolean;
  isPaid: boolean;
  userId: TUser;
};

export type SubscriptionModel = Model<TSubscription, Record<string, undefined>>;
