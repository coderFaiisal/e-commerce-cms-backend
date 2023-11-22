import { Schema, model } from 'mongoose';
import { IMaterial, MaterialModel } from './material.interface';

const materialSchema = new Schema<IMaterial, MaterialModel>(
  {
    name: { type: String, required: true },
    caratId: { type: Schema.Types.ObjectId, ref: 'Carat', required: true },
    storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
  },
  {
    timestamps: true,
  },
);

export const Material = model<IMaterial, MaterialModel>(
  'Material',
  materialSchema,
);
