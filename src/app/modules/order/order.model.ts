import { Schema, Types, model } from 'mongoose';
import { IOrder, OrderModel } from './order.interface';

const orderSchema = new Schema<IOrder, OrderModel>(
  {
    _id: { type: String },
    userEmail: { type: String, required: true },
    storeId: { type: Types.ObjectId, ref: 'Store', required: true },

    orderItems: [
      {
        productId: {
          type: Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],

    isPaid: { type: Boolean, required: true },
    orderStatus: { type: String, default: 'pending' },
    totalCost: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    contactInformation: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      address: { type: String, required: true },
      phoneNumber: { type: String, required: true },
    },
    shippingAddress: { type: String, required: true },
    deliveryMethod: { type: String, required: true },
    trackingNumber: { type: String },
    discounts: { type: String },
    giftMessage: { type: String },
    giftWrapping: { type: String },
    returnPolicy: { type: String },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

export const Order = model<IOrder, OrderModel>('Order', orderSchema);
