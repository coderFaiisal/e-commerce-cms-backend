import { Model } from 'mongoose';
import { TStore } from '../store/type';

export type TBillboard = {
  label: string;
  imageUrl: string;
  storeId?: TStore;
};

export type BillboardModel = Model<TBillboard, Record<string, undefined>>;
