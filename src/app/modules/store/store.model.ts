import { Schema, model } from 'mongoose';
import { IStore, StoreModel } from './store.interface';

const storeSchema = new Schema<IStore, StoreModel>({
  name: { type: String, required: true },
});

export const Store = model<IStore, StoreModel>('Store', storeSchema);
