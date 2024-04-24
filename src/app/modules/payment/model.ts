import { Schema, model } from 'mongoose';
import { PaymentModel, TPayment } from './type';

const paymentSchema = new Schema<TPayment, PaymentModel>(
  {
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
    transactionId: { type: String, required: true },
    paymentGatewayData: { type: Object },
    paymentFor: {
      type: String,
      enum: ['subscription', 'order'],
      required: true,
    },
    paymentForId: { type: Schema.Types.ObjectId, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
  },
);

export const Payment = model<TPayment, PaymentModel>('Payment', paymentSchema);
