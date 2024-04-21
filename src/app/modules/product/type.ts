/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';
import { TAttribute } from '../attribute/type';
import { TCategory } from '../category/type';
import { TStore } from '../store/type';

export type IProduct = {
  storeId: Types.ObjectId | TStore;
  categoryId: Types.ObjectId | TCategory;
  attributeId: Types.ObjectId | TAttribute;

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
  review: string;
  rating?: number;
};
