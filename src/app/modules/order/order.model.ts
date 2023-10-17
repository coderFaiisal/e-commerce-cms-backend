import { Schema, model } from 'mongoose';
import { IOrder, IOrderModel } from './order.interface';

const orderSchema = new Schema<IOrder, IOrderModel>(
  {
    userEmail: { type: String, required: true },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: { type: String, required: true },
    orderStatus: { type: String },
    paymentStatus: { type: String },
    totalCost: { type: String },
    paymentMethod: { type: String },
    contactInformation: {
      name: { type: String },
      email: { type: String },
      address: { type: String },
      phoneNumber: { type: String },
    },
    shippingAddress: { type: String },
    deliveryMethod: { type: String },
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

export const Order = model<IOrder, IOrderModel>('Order', orderSchema);
