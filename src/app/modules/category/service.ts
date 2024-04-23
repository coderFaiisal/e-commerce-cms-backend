import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { Billboard } from '../billboard/model';
import { Product } from '../product/model';
import { Store } from '../store/model';
import { User } from '../user/model';
import { Category } from './model';
import { TCategory } from './type';

const createCategory = async (
  user: JwtPayload | null,
  payload: TCategory,
): Promise<boolean> => {
  const isUserExist = await User.findOne({ email: user?.email }).lean();

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exist!");
  }

  const isStoreExist = await Store.findById(payload.storeId).lean();

  if (!isStoreExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Store doesn't exist!");
  }

  const userIdString = isUserExist._id.toString();
  const storeUserIdString = isStoreExist.userId.toString();

  if (userIdString !== storeUserIdString) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden access.');
  }

  const isCategoryExist = await Category.findOne({
    name: payload.name,
    storeId: payload.storeId,
  }).lean();

  if (isCategoryExist) {
    throw new ApiError(httpStatus.CONFLICT, 'Category already exist!');
  }

  await Category.create(payload);

  return true;
};

const getAllCategories = async (
  storeId: string,
): Promise<TCategory[] | null> => {
  const result = await Category.find({ storeId }).populate('storeId').lean();

  return result;
};

const getSingleCategory = async (
  categoryId: string,
): Promise<TCategory | null> => {
  const result = await Category.findById(categoryId).populate('storeId').lean();

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Category doesn't found.");
  }

  return result;
};

const updateCategory = async (
  user: JwtPayload | null,
  categoryId: string,
  updatedData: Partial<TCategory>,
): Promise<boolean> => {
  const isCategoryExist =
    await Category.findById(categoryId).populate('storeId');

  if (!isCategoryExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Category doesn't exist!");
  }

  const isUserExist = await User.findOne({ email: user?.email }).lean();

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exist!");
  }

  const userIdString = isUserExist._id.toString();
  const storeUserIdString = isCategoryExist.storeId?.userId.toString();

  if (userIdString !== storeUserIdString) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden access.');
  }

  await Category.findByIdAndUpdate(categoryId, updatedData);

  return true;
};

const deleteCategory = async (
  user: JwtPayload | null,
  categoryId: string,
): Promise<boolean> => {
  const isCategoryExist =
    await Category.findById(categoryId).populate('storeId');

  if (!isCategoryExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Category doesn't exist!");
  }

  const isUserExist = await User.findOne({ email: user?.email }).lean();

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exist!");
  }

  const userIdString = isUserExist._id.toString();
  const storeUserIdString = isCategoryExist.storeId?.userId.toString();

  if (userIdString !== storeUserIdString) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden access.');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    await Product.deleteMany({ categoryId }).session(session);

    await Billboard.deleteMany({ categoryId }).session(session);

    await Category.findByIdAndDelete(categoryId).session(session);

    await session.commitTransaction();
    session.endSession();

    return true;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    throw error;
  }
};

export const CategoryService = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
