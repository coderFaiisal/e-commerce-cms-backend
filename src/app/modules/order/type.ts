import { Model, Types } from 'mongoose';
import { TProduct } from '../product/type';
import { TStore } from '../store/type';

export type TOrder = {
  userEmail: string;
  storeId: Types.ObjectId | TStore;
  orderItems: [
    {
      productId: Types.ObjectId | TProduct;
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

export type OrderModel = Model<TOrder, Record<string, undefined>>;
