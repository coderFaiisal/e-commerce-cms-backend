import { Schema, Types, model } from 'mongoose';
import { IProduct, ProductModel } from './product.interface';

const productSchema = new Schema<IProduct, ProductModel>(
  {
    storeId: { type: Types.ObjectId, ref: 'Store', required: true },
    categoryId: { type: Types.ObjectId, ref: 'Category', required: true },
    materialId: { type: Types.ObjectId, ref: 'Material', required: true },
    caratId: { type: Types.ObjectId, ref: 'Carat', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    productCode: { type: String, required: true },
    description: { type: String, required: true },
    images: [String],
    isFeatured: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
    status: { type: String, enum: ['stock', 'stock out'], required: true },
    stockQuantity: { type: Number, required: true },
    materials: [String],
    dimensions: { type: String, required: true },
    metalType: { type: String, required: true },
    discounts: { type: String, required: true },
    ratings: { type: Number, required: true },
    returnPolicy: { type: String, required: true },
    customizable: { type: Boolean, default: false },
    reviews: [
      {
        userId: { type: Types.ObjectId, ref: 'User', required: true },
        userName: { type: String, required: true },
        review: { type: String, required: true },
        rating: { type: Number, required: true },
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
