/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';
import { ICategory } from '../category/category.interface';

export type IStore = {
  name: string;
  categories?: Types.ObjectId[] | ICategory[];
};

export type StoreModel = {
  isStoreExist(storeName: string): boolean;
} & Model<IStore>;
