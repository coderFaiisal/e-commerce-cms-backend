import { Schema, Types, model } from 'mongoose';
import { IStore, StoreModel } from './store.interface';

const storeSchema = new Schema<IStore, StoreModel>(
  {
    _id: { type: String },
    name: { type: String, required: true, unique: true },

    billboards: [{ type: Types.ObjectId, ref: 'Billboard' }],
    categories: [{ type: Types.ObjectId, ref: 'Category' }],
    products: [{ type: Types.ObjectId, ref: 'Product' }],
    carats: [{ type: Types.ObjectId, ref: 'Carat' }],
    materials: [{ type: Types.ObjectId, ref: 'Material' }],
    orders: [{ type: Types.ObjectId, ref: 'Order' }],
  },
  {
    timestamps: true,
  },
);

storeSchema.statics.isStoreExist = async function (
  storeName: string,
): Promise<IStore | null> {
  return await Store.findOne({ name: storeName }).lean();
};

export const Store = model<IStore, StoreModel>('Store', storeSchema);
