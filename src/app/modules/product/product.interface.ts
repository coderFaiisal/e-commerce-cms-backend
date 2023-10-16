/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export type IProduct = {
  title: string;
  description: string;
  images: string;
  price: string;
  status: string;
  ratings: string;
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
  price?: string;
  title?: string;
};

export type IReview = {
  userName: string;
  review: string;
};
