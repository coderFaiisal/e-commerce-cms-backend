import { Model, Types } from 'mongoose';

export type IOrder = {
  userEmail: string;
  productId: Types.ObjectId;
  quantity: string;
  orderStatus: string;
  paymentStatus: string;
  totalCost: string;
  paymentMethod: string;
  contactInformation: {
    name: string;
    email: string;
    address: string;
    phoneNumber: string;
  };
  shippingAddress: string;
  deliveryMethod: string;
  trackingNumber: string;
  discounts: string;
  giftMessage: string;
  giftWrapping: string;
  returnPolicy: string;
};

export type IOrderModel = Model<IOrder, Record<string, unknown>>;
