/* eslint-disable no-unused-vars */
import mongoose, { Model, Types } from 'mongoose';
import { TAttribute } from '../attribute/type';
import { TCategory } from '../category/type';
import { TProductReview } from '../productReview/type';
import { TStore } from '../store/type';

export type TProduct = {
  name: string;
  price: number;
  productCode?: string;
  description: string;
  isFeatured?: boolean;
  isArchived?: boolean;
  status: 'stock' | 'stock out';
  stockQuantity: number;
  discounts?: number;
  returnPolicy?: string;

  storeId: TStore;
  categoryId: Types.ObjectId | TCategory;
  attributeIds: Types.ObjectId[] | TAttribute[];
};

export type TProductImage = {
  url: string;
  productId: Types.ObjectId | TProduct;
};

export type ProductModel = Model<TProduct, Record<string, undefined>>;

export type ProductImageModel = Model<TProductImage, Record<string, undefined>>;

export type TProductFilter = {
  searchTerm?: string;
  price?: string;
  status?: string;
  discounts?: string;
};

export type TGetAllProductsResponse = {
  product: TProduct & { _id: string };
  images: (mongoose.FlattenMaps<TProductImage> & {
    _id: mongoose.Types.ObjectId;
  })[];
  reviews: (mongoose.FlattenMaps<TProductReview> & {
    _id: mongoose.Types.ObjectId;
  })[];
}[];

export type TUpdateProductData = Partial<
  TProduct & {
    productImages: TProductImageUpdateData[];
  }
>;

export type TProductImageUpdateData = {
  productImageId: string;
  url?: string;
  isDeleted: boolean;
};
