import { Schema, model } from 'mongoose';
import { BillboardModel, TBillboard } from './type';

const billboardSchema = new Schema<TBillboard, BillboardModel>(
  {
    label: { type: String, required: true },
    imageUrl: { type: String, required: true },
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

export const Billboard = model<TBillboard, BillboardModel>(
  'Billboard',
  billboardSchema,
);
