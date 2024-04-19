import { Schema, Types, model } from 'mongoose';
import { StoreModel, TStore } from './type';

const storeSchema = new Schema<TStore, StoreModel>(
  {
    name: { type: String, required: true },
    userId: { type: Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
  },
);

storeSchema.statics.isStoreExist = async function (
  storeName: string,
  id: Types.ObjectId,
): Promise<TStore | null> {
  return await Store.findOne({ name: storeName, userId: id })
    .populate('userId')
    .lean();
};

export const Store = model<TStore, StoreModel>('Store', storeSchema);
