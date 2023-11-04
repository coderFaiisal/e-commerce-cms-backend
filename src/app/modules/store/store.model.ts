import { Schema, Types, model } from 'mongoose';
import { IStore, StoreModel } from './store.interface';

const storeSchema = new Schema<IStore, StoreModel>({
  _id: { type: String },
  name: { type: String, required: true, unique: true },

  billboards: [{ type: Types.ObjectId, ref: 'Billboard', required: true }],

  categories: [{ type: Types.ObjectId, ref: 'Category', required: true }],

  products: [{ type: Types.ObjectId, ref: 'Product', required: true }],

  carats: [{ type: Types.ObjectId, ref: 'Carat', required: true }],

  materials: [{ type: Types.ObjectId, ref: 'Material', required: true }],

  orders: [{ type: Types.ObjectId, ref: 'Order', required: true }],
});

storeSchema.statics.isStoreExist = async function (
  storeName: string,
): Promise<IStore | null> {
  return await Store.findOne({ name: storeName }).lean();
};

export const Store = model<IStore, StoreModel>('Store', storeSchema);
