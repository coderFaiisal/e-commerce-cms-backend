import { Schema, Types, model } from 'mongoose';
import { BillboardModel, IBillboard } from './billboard.interface';

const billboardSchema = new Schema<IBillboard, BillboardModel>(
  {
    _id: { type: String },
    label: { type: String, required: true },
    imageURL: { type: String, required: true },
    categories: [{ type: Types.ObjectId, ref: 'Category' }],
  },
  {
    timestamps: true,
  },
);

export const Billboard = model<IBillboard, BillboardModel>(
  'Billboard',
  billboardSchema,
);
