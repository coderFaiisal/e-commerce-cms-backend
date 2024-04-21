import { Model, Types } from 'mongoose';
import { TProduct } from '../product/type';
import { TUser } from '../user/type';

export type TProductReview = {
  rating: number;
  message?: string;
  productId: Types.ObjectId | TProduct;
  userId?: Types.ObjectId | TUser;
};

export type ProductReviewModel = Model<
  TProductReview,
  Record<string, undefined>
>;
