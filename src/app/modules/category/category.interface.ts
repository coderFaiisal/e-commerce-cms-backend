import { Model, Types } from 'mongoose';
import { IBillboard } from '../billboard/billboard.interface';
import { IProduct } from '../product/product.interface';
import { IStore } from '../store/store.interface';

export type ICategory = {
  name: string;
  code: string;
  storeId: Types.ObjectId | IStore;
  billboardId: Types.ObjectId | IBillboard;
  products?: Types.ObjectId[] | IProduct[];
};

export type CategoryModel = Model<ICategory, Record<string, undefined>>;
