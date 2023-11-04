import { Model, Types } from 'mongoose';
import { IProduct } from '../product/product.interface';
import { IStore } from '../store/store.interface';

export type ICarat = {
  _id?: string;
  name: string;
  value: string;
  storeId: Types.ObjectId | IStore;
  products?: Types.ObjectId[] | IProduct[];
};

export type CaratModel = Model<ICarat, Record<string, undefined>>;
