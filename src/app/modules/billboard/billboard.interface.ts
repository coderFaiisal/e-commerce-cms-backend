import { Model, Types } from 'mongoose';
import { IStore } from '../store/store.interface';

export type IBillboard = {
  label: string;
  imageURL: string;
  storeId: Types.ObjectId | IStore;
};

export type BillboardModel = Model<IBillboard, Record<string, undefined>>;
