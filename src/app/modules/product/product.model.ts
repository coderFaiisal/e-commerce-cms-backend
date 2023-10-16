import { Schema, model } from 'mongoose';
import { IProduct, ProductModel } from './product.interface';

const productSchema = new Schema<IProduct, ProductModel>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: { type: String, required: true },
    price: { type: String, required: true },
    status: { type: String, required: true },
    ratings: { type: String, required: true },
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
