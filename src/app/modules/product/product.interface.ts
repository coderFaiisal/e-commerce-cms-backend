/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';
import { ICarat } from '../carat/carat.interface';
import { ICategory } from '../category/category.interface';
import { IMaterial } from '../material/material.interface';
import { IStore } from '../store/store.interface';

export type IProduct = {
  storeId: Types.ObjectId | IStore;
  categoryId: Types.ObjectId | ICategory;
  materialId: Types.ObjectId | IMaterial;
  caratId: Types.ObjectId | ICarat;
  name: string;
  price: number;
  productCode?: string;
  description: string;
  images: string[];
  isFeatured?: boolean;
  isArchived?: boolean;
  status: 'stock' | 'stock out';
  stockQuantity: number;
  materials?: string[];
  dimensions?: string;
  metalType?: string;
  discounts?: string;
  ratings?: number;
  returnPolicy?: string;
  customizable?: boolean;
  reviews?: IProductReview[];
};

export type ProductModel = {
  isProductExist(productId: string): Promise<IProduct | null>;
} & Model<IProduct>;

export type IProductFilter = {
  searchTerm?: string;
  price?: string;
  status?: string;
  ratings?: string;
  materials?: string;
  discounts?: string;
  customizable?: string;
};

export type IProductReview = {
  userName: string;
  userEmail: string;
  review: string;
  rating?: number;
};
