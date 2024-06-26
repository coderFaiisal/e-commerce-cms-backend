import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { asyncForEach } from '../../../shared/asyncForEach';
import { RedisClient } from '../../../shared/redis';
import { Attribute } from '../attribute/model';
import { Billboard } from '../billboard/model';
import { Category } from '../category/model';
import { Order, OrderItem } from '../order/model';
import { Product, ProductImage } from '../product/model';
import { ProductReview } from '../productReview/model';
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
    throw new ApiError(httpStatus.BAD_REQUEST, 'Pro plan limit was exceeded.');
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

const getSingleStore = async (
  storeId: string,
): Promise<TStore | string | null> => {
  const isCacheExist = await RedisClient.get(storeId);

  if (isCacheExist) {
    return isCacheExist;
  }

  const result = await Store.findById(storeId).lean();

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Store doesn't found.");
  }

  await RedisClient.set(storeId, result, 'EX', 604800);

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

  const result = await Store.findByIdAndUpdate(storeId, updatedData, {
    new: true,
  });

  await RedisClient.set(storeId, result, 'EX', 604800);

  return true;
};

const deleteStore = async (
  storeId: string,
  user: JwtPayload | null,
): Promise<boolean> => {
  const isStoreExist = await Store.findById(storeId).lean();

  if (!isStoreExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Store doesn't found.");
  }

  const isUserExist = await User.findOne({ email: user?.email }).lean();

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exist!");
  }

  const userIdString = isUserExist._id.toString();
  const storeUserIdString = isStoreExist.userId.toString();

  if (userIdString !== storeUserIdString) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden access.');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const deleteProducts = await Product.find({ storeId }, { _id: 1 }).session(
      session,
    );

    await asyncForEach(
      deleteProducts,
      async (product: { _id: mongoose.ObjectId }) => {
        await ProductImage.deleteMany({ productId: product._id }).session(
          session,
        );

        await ProductReview.deleteMany({ productId: product._id }).session(
          session,
        );

        await Product.findByIdAndDelete(product._id).session(session);
      },
    );

    const deleteOrders = await Order.find({ storeId }, { _id: 1 }).session(
      session,
    );

    await asyncForEach(
      deleteOrders,
      async (order: { _id: mongoose.ObjectId }) => {
        await OrderItem.deleteMany({ orderId: order._id }).session(session);

        await Order.findByIdAndDelete(order._id).session(session);
      },
    );

    await Billboard.deleteMany({ storeId }).session(session);

    await Category.deleteMany({ storeId }).session(session);

    await Attribute.deleteMany({ storeId }).session(session);

    await Store.findByIdAndDelete(storeId).session(session);

    await session.commitTransaction();
    session.endSession();

    await RedisClient.del(storeId);

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
