import { Schema, model } from 'mongoose';
import {
  ProductImageModel,
  ProductModel,
  TProduct,
  TProductImage,
} from './type';

const productSchema = new Schema<TProduct, ProductModel>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    productCode: { type: String },
    description: { type: String, required: true },
    isFeatured: { type: Boolean, default: true },
    isArchived: { type: Boolean, default: false },
    status: { type: String, enum: ['stock', 'stock out'], required: true },
    stockQuantity: { type: Number, required: true },
    discounts: { type: Number },
    returnPolicy: { type: String },

    storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    attributeIds: {
      type: [Schema.Types.ObjectId],
      ref: 'Attribute',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const productImageSchema = new Schema<TProductImage, ProductImageModel>({
  url: { type: String, required: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
});

export const Product = model<TProduct, ProductModel>('Product', productSchema);

export const ProductImage = model<TProductImage, ProductImageModel>(
  'ProductImage',
  productImageSchema,
);
