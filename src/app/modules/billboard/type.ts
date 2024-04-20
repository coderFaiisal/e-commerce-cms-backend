import { Model, Types } from 'mongoose';
import { TCategory } from '../category/type';
import { TStore } from '../store/type';

export type TBillboard = {
  label: string;
  imageUrl: string;
  storeId: TStore;
  categoryId: Types.ObjectId | TCategory;
};

export type BillboardModel = Model<TBillboard, Record<string, undefined>>;
