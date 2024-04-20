import { Model } from 'mongoose';
import { TStore } from '../store/type';

export type TCategory = {
  name: string;
  code: string;
  storeId: TStore;
};

export type CategoryModel = Model<TCategory, Record<string, undefined>>;
