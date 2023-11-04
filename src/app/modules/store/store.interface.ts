/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';
import { IBillboard } from '../billboard/billboard.interface';
import { ICarat } from '../carat/carat.interface';
import { ICategory } from '../category/category.interface';
import { IMaterial } from '../material/material.interface';
import { IOrder } from '../order/order.interface';
import { IProduct } from '../product/product.interface';

export type IStore = {
  _id?: string;
  name: string;
  billboards: Types.ObjectId[] | IBillboard[];
  categories: Types.ObjectId[] | ICategory[];
  products: Types.ObjectId[] | IProduct[];
  carats: Types.ObjectId[] | ICarat[];
  materials: Types.ObjectId[] | IMaterial[];
  orders: Types.ObjectId[] | IOrder[];
};

export type StoreModel = {
  isStoreExist(storeName: string): boolean;
} & Model<IStore>;
