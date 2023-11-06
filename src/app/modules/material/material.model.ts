import { Schema, model } from 'mongoose';
import { IMaterial, MaterialModel } from './material.interface';

const materialSchema = new Schema<IMaterial, MaterialModel>(
  {
    name: { type: String, required: true },
    value: { type: String, required: true },
    storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  },
  {
    timestamps: true,
  },
);

export const Material = model<IMaterial, MaterialModel>(
  'Material',
  materialSchema,
);