import { Model, Types } from 'mongoose';
import { TProduct } from '../product/type';

export type TProductReview = {
  rating: number;
  message?: string;
  productId: Types.ObjectId | TProduct;
};

export type ProductReviewModel = Model<
  TProductReview,
  Record<string, undefined>
>;
