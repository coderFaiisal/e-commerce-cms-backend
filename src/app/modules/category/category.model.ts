import { Schema, model } from 'mongoose';
import { CategoryModel, ICategory } from './category.interface';

const categorySchema = new Schema<ICategory, CategoryModel>(
  {
    name: { type: String, required: true },
    code: { type: String, required: true },
    storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
    billboardId: {
      type: Schema.Types.ObjectId,
      ref: 'Billboard',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Category = model<ICategory, CategoryModel>(
  'Category',
  categorySchema,
);
