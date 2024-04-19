import { Model, Types } from 'mongoose';
import { IStore } from '../store/type';

export type IBillboard = {
  label: string;
  imageURL: string;
  storeId: Types.ObjectId | IStore;
};

export type BillboardModel = Model<IBillboard, Record<string, undefined>>;
