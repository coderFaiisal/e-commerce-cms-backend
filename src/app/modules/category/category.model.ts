import { Schema, Types, model } from 'mongoose';
import { CategoryModel, ICategory } from './category.interface';

const categorySchema = new Schema<ICategory, CategoryModel>(
  {
    _id: { type: String },
    name: { type: String, required: true },
    code: { type: String, required: true },
    storeId: { type: Types.ObjectId, ref: 'Store', required: true },
    billboardId: { type: Types.ObjectId, ref: 'Billboard', required: true },
    products: [{ type: Types.ObjectId, ref: 'Product' }],
  },
  {
    timestamps: true,
  },
);

export const Category = model<ICategory, CategoryModel>(
  'Category',
  categorySchema,
);
