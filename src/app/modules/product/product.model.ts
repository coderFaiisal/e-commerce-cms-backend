import { Schema, model } from 'mongoose';
import { IProduct, ProductModel } from './product.interface';

const productSchema = new Schema<IProduct, ProductModel>(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    productCode: { type: String },
    description: { type: String, required: true },
    photoURL: { type: String, required: true },
    price: { type: String, required: true },
    status: { type: String, enum: ['stock', 'stock out'] },
    stockQuantity: { type: String },
    materials: { type: String },
    dimensions: { type: String },
    metalType: { type: String },
    discounts: { type: String },
    ratings: { type: String },
    returnPolicy: { type: String },
    customizable: { type: String },
    reviews: [
      {
        userName: { type: String },
        review: { type: String },
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
