import { Schema, model } from 'mongoose';
import { IMaterial, MaterialModel } from './material.interface';

const materialSchema = new Schema<IMaterial, MaterialModel>(
  {
    name: { type: String, required: true, unique: true },
    value: { type: String, required: true },
    storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Material = model<IMaterial, MaterialModel>(
  'Material',
  materialSchema,
);
