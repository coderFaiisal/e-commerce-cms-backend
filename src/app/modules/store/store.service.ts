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
  const result = await Store.findByIdAndUpdate(storeId, updatedData, {
    new: true,
  });

  return result;
};

const deleteStore = async (storeId: string): Promise<IStore | null> => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const store = await Store.findById(storeId).session(session);

    if (!store) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Store does not found!');
    }

    // Retrieve associated IDs
    const categoryIds = store?.categories;
    const billboardIds = store?.billboards;
    const caratIds = store?.carats;
    const materialIds = store?.materials;
    const productIds = store?.products;
    const orderIds = store?.orders;

    // Delete documents
    const deletionPromises = [];

    if (billboardIds && billboardIds.length > 0) {
      deletionPromises.push(
        Billboard.deleteMany({ _id: { $in: billboardIds } }).session(session),
      );
    }

    if (categoryIds && categoryIds.length > 0) {
      deletionPromises.push(
        Category.deleteMany({ _id: { $in: categoryIds } }).session(session),
      );
    }

    if (caratIds && caratIds.length > 0) {
      deletionPromises.push(
        Carat.deleteMany({ _id: { $in: caratIds } }).session(session),
      );
    }

    if (materialIds && materialIds.length > 0) {
      deletionPromises.push(
        Material.deleteMany({ _id: { $in: materialIds } }).session(session),
      );
    }

    if (productIds && productIds.length > 0) {
      deletionPromises.push(
        Product.deleteMany({ _id: { $in: productIds } }).session(session),
      );
    }

    if (orderIds && orderIds.length > 0) {
      deletionPromises.push(
        Order.deleteMany({ _id: { $in: orderIds } }).session(session),
      );
    }

    await Promise.all(deletionPromises);

    // Delete the store
    await Store.findByIdAndDelete(storeId).session(session);

    await session.commitTransaction();
    session.endSession();

    return store;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    throw error;
  }
};

export const StoreService = {
  createStore,
  getSingleStore,
  updateStore,
  deleteStore,
};
