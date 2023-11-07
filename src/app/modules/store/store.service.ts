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
    throw new ApiError(httpStatus.CONFLICT, 'Store already exist!');
  }

  const result = await Store.create(store);

  return result;
};

const getSingleStore = async (storeId: string): Promise<IStore | null> => {
  const result = await Store.findById(storeId);

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Store doesn't found");
  }

  return result;
};

const updateStore = async (
  storeId: string,
  updatedData: Partial<IStore>,
): Promise<IStore | null> => {
  const store = await Store.findById(storeId).lean();

  if (!store) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Store does not found!');
  }

  const result = await Store.findByIdAndUpdate(storeId, updatedData, {
    new: true,
  });

  return result;
};

const deleteStore = async (storeId: string): Promise<IStore | null> => {
  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    const store = await Store.findById(storeId).session(session);

    if (!store) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Store does not found!');
    }

    const { billboards, categories, carats, materials, products, orders } =
      store;

    // Delete documents
    const deletionPromises = [];

    if (billboards && billboards.length > 0) {
      deletionPromises.push(
        Billboard.deleteMany({ _id: { $in: billboards } }).session(session),
      );
    }

    if (categories && categories.length > 0) {
      deletionPromises.push(
        Category.deleteMany({ _id: { $in: categories } }).session(session),
      );
    }

    if (carats && carats.length > 0) {
      deletionPromises.push(
        Carat.deleteMany({ _id: { $in: carats } }).session(session),
      );
    }

    if (materials && materials.length > 0) {
      deletionPromises.push(
        Material.deleteMany({ _id: { $in: materials } }).session(session),
      );
    }

    if (products && products.length > 0) {
      deletionPromises.push(
        Product.deleteMany({ _id: { $in: products } }).session(session),
      );
    }

    if (orders && orders.length > 0) {
      deletionPromises.push(
        Order.deleteMany({ _id: { $in: orders } }).session(session),
      );
    }

    await Promise.all(deletionPromises);

    // Delete store
    await Store.findByIdAndDelete(storeId).session(session);

    await session.commitTransaction();

    return store;
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    session.endSession();
  }
};

export const StoreService = {
  createStore,
  getSingleStore,
  updateStore,
  deleteStore,
};
