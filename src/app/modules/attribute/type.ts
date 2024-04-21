import { Model } from 'mongoose';
import { TStore } from '../store/type';

export type TAttribute = {
  type: string;
  name: string;
  value: string;
  storeId: TStore;
};

export type AttributeModel = Model<TAttribute, Record<string, undefined>>;
