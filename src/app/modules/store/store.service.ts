import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { IStore } from './store.interface';
import { Store } from './store.model';

const createStore = async (store: IStore): Promise<IStore | null> => {
  const isStoreExist = Store.isStoreExist(store.name);

  if (isStoreExist) {
    throw new ApiError(httpStatus.CONFLICT, 'Store already exist!');
  }

  const result = await Store.create(store);

  return result;
};

const getSingleStore = async (storeId: string): Promise<IStore | null> => {
  const result = await Store.findById(storeId);

  return result;
};

const updateStore = async (
  storeId: string,
  updatedData: Partial<IStore>,
): Promise<IStore | null> => {
  const result = await Store.findByIdAndUpdate(storeId, updatedData, {
    new: true,
  });

  return result;
};

const deleteStore = async (storeId: string): Promise<IStore | null> => {
  const result = await Store.findByIdAndDelete(storeId);

  return result;
};

export const StoreService = {
  createStore,
  getSingleStore,
  updateStore,
  deleteStore,
};
