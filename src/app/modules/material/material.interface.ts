import { Model, Types } from 'mongoose';
import { ICarat } from '../carat/carat.interface';
import { IStore } from '../store/store.interface';

export type IMaterial = {
  name: string;
  caratId: Types.ObjectId | ICarat;
  storeId: Types.ObjectId | IStore;
};

export type MaterialModel = Model<IMaterial, Record<string, undefined>>;
