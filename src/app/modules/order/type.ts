import mongoose, { Model, Types } from 'mongoose';
import { TProduct } from '../product/type';
import { TStore } from '../store/type';
import { TUser } from '../user/type';

export type TOrder = {
  isPaid: boolean;
  phoneNumber: string;
  orderStatus?: 'pending' | 'processing' | 'delivered' | 'cancel';
  discounts?: number;
  totalCost: number;
  shippingCharge: number;
  shippingAddress: string;
  paymentMethod: string;
  deliveryMethod: string;
  trackingNumber: string;
  giftMessage?: string;
  userId: Types.ObjectId | TUser;
  storeId: Types.ObjectId | TStore;
};

export type TOrderItem = {
  quantity: number;
  productId: Types.ObjectId | TProduct;
  orderId: Types.ObjectId | TProduct;
};

export type OrderModel = Model<TOrder, Record<string, undefined>>;

export type OrderItemModel = Model<TOrderItem, Record<string, undefined>>;

export type TOrdersResponse = {
  order: TOrder & { _id: string };
  orderItems: (mongoose.FlattenMaps<TOrderItem> & {
    _id: mongoose.Types.ObjectId;
  })[];
};
