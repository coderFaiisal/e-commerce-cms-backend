import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { Billboard } from '../billboard/model';
import { Carat } from '../carat/carat.model';
import { Category } from '../category/model';
import { Material } from '../material/material.model';
import { Order } from '../order/order.model';
import { Product } from '../product/product.model';
import { Subscription } from '../subscription/model';
import { plans } from '../subscription/type';
import { User } from '../user/model';
import { Store } from './model';
import { TStore } from './type';

const createStore = async (
  user: JwtPayload | null,
  payload: Partial<TStore>,
): Promise<TStore> => {
  const isUserExist = await User.findOne({ email: user?.email }).lean();

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exist!");
  }

  const isStoreExist = await Store.isStoreExist(
    payload.name as string,
    isUserExist._id,
  );

  if (isStoreExist) {
    throw new ApiError(httpStatus.CONFLICT, 'Store already exist!');
  }

  const userSubscription = await Subscription.findOne({
    userId: isUserExist._id,
    isActive: true,
  }).lean();

  if (!userSubscription) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'You have not subscribed yet!');
  }

  const userStores = await Store.find({ userId: isUserExist._id }).lean();

  if (userStores.length >= 3 && userSubscription.plan === plans.Basic) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Upgrade your plan.');
  }

  if (userStores.length >= 10 && userSubscription.plan === plans.Pro) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Pro plan limit was exceeded. ');
  }

  payload.userId = isUserExist._id;

  const result = await Store.create(payload);

  return result;
};

const isStoreExist = async (
  user: JwtPayload | null,
): Promise<TStore | null> => {
  const isUserExist = await User.findOne({ email: user?.email }).lean();

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exist!");
  }

  const result = await Store.find({ userId: isUserExist?._id }).sort({
    createdAt: 1,
  });

  return result[0];
};

const getAllStores = async (
  user: JwtPayload | null,
): Promise<TStore[] | null> => {
  const isUserExist = await User.findOne({ email: user?.email }).lean();

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exist!");
  }

  const result = await Store.find({ userId: isUserExist?._id });

  return result;
};

const getSingleStore = async (storeId: string): Promise<TStore | null> => {
  const result = await Store.findById(storeId).lean();

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Store doesn't foun");
  }

  return result;
};

const updateStore = async (
  storeId: string,
  user: JwtPayload | null,
  updatedData: Partial<TStore>,
): Promise<boolean> => {
  const isUserExist = await User.findOne({ email: user?.email }).lean();

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exist!");
  }

  const store = await Store.findById(storeId).lean();

  if (!store) {
    throw new ApiError(httpStatus.NOT_FOUND, "Store doesn't found.");
  }

  const userIdString = isUserExist._id.toString();
  const storeUserIdString = store.userId.toString();

  if (userIdString !== storeUserIdString) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden access.');
  }

  await Store.findByIdAndUpdate(storeId, updatedData);

  return true;
};

const deleteStore = async (
  storeId: string,
  user: JwtPayload | null,
): Promise<boolean> => {
  const store = await Store.findById(storeId).lean();

  if (!store) {
    throw new ApiError(httpStatus.NOT_FOUND, "Store doesn't found.");
  }

  const isUserExist = await User.findOne({ email: user?.email }).lean();

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exist!");
  }

  const userIdString = isUserExist._id.toString();
  const storeUserIdString = store.userId.toString();

  if (userIdString !== storeUserIdString) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden access.');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    //! have to update delete models and logic.

    await Billboard.deleteMany({ storeId: storeId }).session(session);

    await Category.deleteMany({ storeId: storeId }).session(session);

    await Carat.deleteMany({ storeId: storeId }).session(session);

    await Material.deleteMany({ storeId: storeId }).session(session);

    await Product.deleteMany({ storeId: storeId }).session(session);

    await Order.deleteMany({ storeId: storeId }).session(session);

    await Store.findByIdAndDelete(storeId).session(session);

    await session.commitTransaction();
    session.endSession();

    return true;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    throw error;
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
