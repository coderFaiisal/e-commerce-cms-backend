import { Model, Types } from 'mongoose';
import { IBillboard } from '../billboard/type';
import { IStore } from '../store/type';

export type ICategory = {
  name: string;
  code: string;
  storeId: Types.ObjectId | IStore;
  billboardId: Types.ObjectId | IBillboard;
};

export type CategoryModel = Model<ICategory, Record<string, undefined>>;
