import { Schema, model } from 'mongoose';
import { IStore, StoreModel } from './store.interface';

const storeSchema = new Schema<IStore, StoreModel>(
  {
    name: { type: String, required: true, unique: true },
    categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
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
