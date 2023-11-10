import httpStatus from 'http-status';
import mongoose from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { Store } from '../store/store.model';
import { ICategory } from './category.interface';
import { Category } from './category.model';

const createCategory = async (
  categoryData: ICategory,
): Promise<ICategory | null> => {
  const isCategoryExist = await Category.findOne({
    name: categoryData.name,
  }).lean();

  if (isCategoryExist) {
    throw new ApiError(httpStatus.CONFLICT, 'Category already exist');
  }

  let result = null;

  //start transaction
  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    result = await Category.create([categoryData], { session });

    await Store.findByIdAndUpdate(categoryData.storeId, {
      $push: { categories: result[0]._id },
    }).session(session);

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    await session.endSession();
  }

  return result[0];
};

const getAllCategories = async (): Promise<ICategory[] | null> => {
  const result = await Category.find({})
    .populate('storeId')
    .populate('billboardId')
    .lean();
  return result;
};

const getSingleCategory = async (
  categoryId: string,
): Promise<ICategory | null> => {
  const result = await Category.findById(categoryId)
    .populate('storeId')
    .populate('billboardId')
    .lean();

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category does not found');
  }

  return result;
};

const updateCategory = async (
  categoryId: string,
  updatedData: Partial<ICategory>,
): Promise<ICategory | null> => {
  const result = await Category.findByIdAndUpdate(categoryId, updatedData, {
    new: true,
  })
    .populate('storeId')
    .populate('billboardId')
    .lean();

  if (!result) {
    throw new ApiError(httpStatus.NOT_MODIFIED, 'Failed to update category');
  }

  return result;
};

const deleteCategory = async (
  categoryId: string,
): Promise<ICategory | null> => {
  const result = await Category.findByIdAndDelete(categoryId);
  return result;
};

export const CategoryService = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
