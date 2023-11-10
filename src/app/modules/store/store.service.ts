import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { IStore } from './store.interface';
import { Store } from './store.model';

const createStore = async (store: IStore): Promise<IStore | null> => {
  const isStoreExist = await Store.isStoreExist(store.name);

  if (isStoreExist) {
    throw new ApiError(httpStatus.CONFLICT, 'Store already exist');
  }

  const result = await Store.create(store);

  return result;
};

const getSingleStore = async (storeId: string): Promise<IStore | null> => {
  const result = await Store.findById(storeId);

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Store does not found');
  }

  return result;
};

const updateStore = async (
  storeId: string,
  updatedData: Partial<IStore>,
): Promise<IStore | null> => {
  const store = await Store.findById(storeId).lean();

  if (!store) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Store does not found');
  }

  const result = await Store.findByIdAndUpdate(storeId, updatedData, {
    new: true,
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_MODIFIED, 'Failed to update store');
  }

  return result;
};

const deleteStore = async (storeId: string): Promise<IStore | null> => {
  // const session = await mongoose.startSession();
  // session.startTransaction();
  // try {
  //   const store = await Store.findById(storeId).session(session);
  //   if (!store) {
  //     throw new ApiError(httpStatus.NOT_FOUND, 'Store does not found');
  //   }
  //   const { categories } = store;
  //   // Delete documents
  //   //! Have to add functionality
  //   const deletionPromises = [];
  //   if (categories && categories.length > 0) {
  //     deletionPromises.push(
  //       Category.deleteMany({ _id: { $in: categories } }).session(session),
  //     );
  //   }
  //   await Promise.all(deletionPromises);
  //   // Delete store
  //   await Store.findByIdAndDelete(storeId).session(session);
  //   await session.commitTransaction();
  //   return store;
  // } catch (error) {
  //   await session.abortTransaction();
  //   throw error;
  // } finally {
  //   session.endSession();
  // }

  console.log(storeId);
  return null;
};

export const StoreService = {
  createStore,
  getSingleStore,
  updateStore,
  deleteStore,
};
