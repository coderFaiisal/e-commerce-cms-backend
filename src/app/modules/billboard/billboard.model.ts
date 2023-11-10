import { Schema, model } from 'mongoose';
import { BillboardModel, IBillboard } from './billboard.interface';

const billboardSchema = new Schema<IBillboard, BillboardModel>(
  {
    label: { type: String, required: true },
    imageURL: { type: String, required: true },
    storeId: { type: Schema.Types.ObjectId, required: true },
  },
  {
    timestamps: true,
  },
);

export const Billboard = model<IBillboard, BillboardModel>(
  'Billboard',
  billboardSchema,
);
