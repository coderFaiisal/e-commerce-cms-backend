import { Model, Types } from 'mongoose';
import { ICategory } from '../category/category.interface';
import { IStore } from '../store/store.interface';

export type IMaterial = {
  name: string;
  value: string;
  storeId: Types.ObjectId | IStore;
  categoryId: Types.ObjectId | ICategory;
};

export type MaterialModel = Model<IMaterial, Record<string, undefined>>;
