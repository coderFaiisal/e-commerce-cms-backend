import { Model, Types } from 'mongoose';
import { TUser } from '../user/type';

export type TPayment = {
  amount: number;
  status: 'pending' | 'paid';
  transactionId: string;
  paymentGatewayData?: JSON;
  paymentFor: 'subscription' | 'order';
  paymentForId: Types.ObjectId;
  userId: Types.ObjectId | TUser;
};

export type PaymentModel = Model<TPayment, Record<string, undefined>>;
