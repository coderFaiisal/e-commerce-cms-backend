/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export type IStore = {
  name: string;
};

export type StoreModel = {
  isStoreExist(storeName: string): boolean;
} & Model<IStore>;
