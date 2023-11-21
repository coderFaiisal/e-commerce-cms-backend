import { Model, Types } from 'mongoose';
import { IStore } from '../store/store.interface';

export type IMaterial = {
  name: string;
  value: string;
  storeId: Types.ObjectId | IStore;
};

export type MaterialModel = Model<IMaterial, Record<string, undefined>>;
