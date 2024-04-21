import { Model, Types } from 'mongoose';
import { IProduct } from '../product/type';
import { IStore } from '../store/type';

export type IOrder = {
  userEmail: string;
  storeId: Types.ObjectId | IStore;
  orderItems: [
    {
      productId: Types.ObjectId | IProduct;
      quantity: number;
    },
  ];
  isPaid: boolean;
  orderStatus?: 'pending' | 'processing' | 'delivered';
  totalCost: number;
  shippingCharge: number;
  paymentMethod: string;
  contactInformation: {
    name: string;
    email: string;
    address: string;
    phoneNumber: string;
  };
  shippingAddress: string;
  deliveryMethod: string;
  trackingNumber?: string;
  discounts?: string;
  giftMessage?: string;
  giftWrapping?: string;
  returnPolicy?: string;
};

export type OrderModel = Model<IOrder, Record<string, undefined>>;
