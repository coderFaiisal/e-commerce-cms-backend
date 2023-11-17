import httpStatus from 'http-status';
import mongoose from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { Billboard } from '../billboard/billboard.model';
import { Carat } from '../carat/carat.model';
import { Category } from '../category/category.model';
import { Material } from '../material/material.model';
import { Order } from '../order/order.model';
import { Product } from '../product/product.model';
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

const isStoreExist = async (): Promise<IStore | null> => {
  const result = await Store.find({}).sort({ createdAt: -1 });

  return result[0];
};

const getAllStores = async (): Promise<IStore[] | null> => {
  const result = await Store.find({});

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
  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    const store = await Store.findById(storeId).session(session);

    if (!store) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Store does not found');
    }

    await Billboard.deleteMany({ storeId: storeId }).session(session);

    await Category.deleteMany({ storeId: storeId }).session(session);

    await Carat.deleteMany({ storeId: storeId }).session(session);

    await Material.deleteMany({ storeId: storeId }).session(session);

    await Product.deleteMany({ storeId: storeId }).session(session);

    await Order.deleteMany({ storeId: storeId }).session(session);

    const result = await Store.findByIdAndDelete(storeId).session(session);

    await session.commitTransaction();

    return result;
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    session.endSession();
  }
};

export const StoreService = {
  createStore,
  isStoreExist,
  getAllStores,
  getSingleStore,
  updateStore,
  deleteStore,
};
