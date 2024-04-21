import { Schema, model } from 'mongoose';
import { ProductReviewModel, TProductReview } from './type';

const productReviewSchema = new Schema<TProductReview, ProductReviewModel>({
  rating: { type: Number, required: true },
  message: { type: String },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

export const ProductReview = model<TProductReview, ProductReviewModel>(
  'ProductReview',
  productReviewSchema,
);
