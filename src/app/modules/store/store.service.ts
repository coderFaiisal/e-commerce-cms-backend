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

export const StoreService = {
  createStore,
};
