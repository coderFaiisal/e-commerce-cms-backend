import { Schema, model } from 'mongoose';
import { CategoryModel, TCategory } from './type';

const categorySchema = new Schema<TCategory, CategoryModel>(
  {
    name: { type: String, required: true },
    code: { type: String, required: true },
    storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
  },
  {
    timestamps: true,
  },
);

export const Category = model<TCategory, CategoryModel>(
  'Category',
  categorySchema,
);
