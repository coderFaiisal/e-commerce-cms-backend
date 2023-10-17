/* eslint-disable no-unused-vars */
/* eslintdisable no-unused-vars */
import { Model } from 'mongoose';

export type IProduct = {
  name: string;
  category: string;
  productCode: string;
  description: string;
  photoURL: string;
  price: string;
  status: 'stock' | 'stock out';
  stockQuantity: string;
  materials: string;
  dimensions: string;
  metalType: string;
  discounts: string;
  ratings: string;
  returnPolicy: string;
  customizable: string;
  reviews?: {
    userName: string;
    review: string;
  }[];
};

export type ProductModel = {
  isProductExist(productId: string): Promise<IProduct | null>;
} & Model<IProduct>;

export type IProductFilter = {
  searchTerm?: string;
  category?: string;
  price?: string;
  title?: string;
  status?: string;
  materials?: string;
  discounts?: string;
};

export type IReview = {
  userName: string;
  review: string;
};
