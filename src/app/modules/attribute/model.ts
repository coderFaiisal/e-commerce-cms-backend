import { Schema, model } from 'mongoose';
import { AttributeModel, TAttribute } from './type';

const attributeSchema = new Schema<TAttribute, AttributeModel>(
  {
    type: { type: String, required: true },
    name: { type: String, required: true },
    value: { type: String, required: true },
    storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
  },
  {
    timestamps: true,
  },
);

export const Attribute = model<TAttribute, AttributeModel>(
  'Attribute',
  attributeSchema,
);
