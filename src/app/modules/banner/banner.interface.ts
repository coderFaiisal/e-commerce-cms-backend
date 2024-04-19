import { Model, Types } from 'mongoose';
import { IStore } from '../store/type';

export type IBanner = {
  label: string;
  imageURL: string;
  storeId: Types.ObjectId | IStore;
};

export type BannerModel = Model<IBanner, Record<string, undefined>>;
