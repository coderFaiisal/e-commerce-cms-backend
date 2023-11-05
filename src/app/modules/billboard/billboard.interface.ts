import { Model, Types } from 'mongoose';
import { ICategory } from '../category/category.interface';
import { IStore } from '../store/store.interface';

export type IBillboard = {
  label: string;
  imageURL: string;
  storeId: Types.ObjectId | IStore;
  categories: Types.ObjectId[] | ICategory[];
};

export type BillboardModel = Model<IBillboard, Record<string, undefined>>;
