import { Schema, model } from 'mongoose';
import { IStore, StoreModel } from './store.interface';

const storeSchema = new Schema<IStore, StoreModel>(
  {
    _id: { type: String },
    name: { type: String, required: true, unique: true },

    billboards: [{ type: Schema.Types.ObjectId, ref: 'Billboard' }],
    categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    carats: [{ type: Schema.Types.ObjectId, ref: 'Carat' }],
    materials: [{ type: Schema.Types.ObjectId, ref: 'Material' }],
    orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
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
