import { Model, Types } from 'mongoose';
import { IStore } from '../store/type';

export type ICarat = {
  name: string;
  value: string;
  storeId: Types.ObjectId | IStore;
};

export type CaratModel = Model<ICarat, Record<string, undefined>>;
