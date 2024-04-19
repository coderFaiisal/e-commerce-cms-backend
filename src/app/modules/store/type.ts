/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';
import { TUser } from '../user/type';

export type TStore = {
  name: string;
  userId: Types.ObjectId | TUser;
};

export type StoreModel = {
  isStoreExist(storeName: string, id: Types.ObjectId): TStore | null;
} & Model<TStore>;
