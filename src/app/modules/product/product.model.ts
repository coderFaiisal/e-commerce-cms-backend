import { Schema, model } from 'mongoose';
import { IProduct, ProductModel } from './product.interface';

const productSchema = new Schema<IProduct, ProductModel>(
  {
    storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    materialId: {
      type: Schema.Types.ObjectId,
      ref: 'Material',
      required: true,
    },
    caratId: { type: Schema.Types.ObjectId, ref: 'Carat', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    productCode: { type: String },
    description: { type: String, required: true },
    images: { type: [String], required: true },
    isFeatured: { type: Boolean, default: true },
    isArchived: { type: Boolean, default: false },
    status: { type: String, enum: ['stock', 'stock out'], required: true },
    stockQuantity: { type: Number, required: true },
    materials: { type: [String] },
    dimensions: { type: String },
    metalType: { type: String },
    discounts: { type: String },
    ratings: { type: Number },
    returnPolicy: { type: String },
    customizable: { type: Boolean, default: false },
    reviews: [
      {
        userName: { type: String, required: true },
        userEmail: { type: String, required: true },
        review: { type: String, required: true },
        rating: { type: Number },
      },
    ],
  },
  {
    timestamps: true,
  },
);

productSchema.statics.isProductExist = async function (
  productId: string,
): Promise<IProduct | null> {
  return await Product.findById(productId).lean();
};

export const Product = model<IProduct, ProductModel>('Product', productSchema);
