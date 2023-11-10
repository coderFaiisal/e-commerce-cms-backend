import { Model, Types } from 'mongoose';
import { IBillboard } from '../billboard/billboard.interface';
import { IStore } from '../store/store.interface';

export type ICategory = {
  name: string;
  code: string;
  storeId: Types.ObjectId | IStore;
  billboardId: Types.ObjectId | IBillboard;
};

export type CategoryModel = Model<ICategory, Record<string, undefined>>;
