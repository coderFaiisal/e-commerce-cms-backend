import { Model, Types } from 'mongoose';
import { ICategory } from '../category/category.interface';
import { IStore } from '../store/store.interface';

export type ICarat = {
  name: string;
  value: string;
  storeId: Types.ObjectId | IStore;
  categoryId: Types.ObjectId | ICategory;
};

export type CaratModel = Model<ICarat, Record<string, undefined>>;
