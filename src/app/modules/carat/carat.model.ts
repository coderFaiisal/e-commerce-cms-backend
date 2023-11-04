import { Schema, Types, model } from 'mongoose';
import { CaratModel, ICarat } from './carat.interface';

const caratSchema = new Schema<ICarat, CaratModel>(
  {
    _id: { type: String },
    name: { type: String, required: true },
    value: { type: String, required: true },
    storeId: { type: Types.ObjectId, ref: 'Store', required: true },
    products: [{ type: Types.ObjectId, ref: 'Product' }],
  },
  {
    timestamps: true,
  },
);

export const Carat = model<ICarat, CaratModel>('Carat', caratSchema);
