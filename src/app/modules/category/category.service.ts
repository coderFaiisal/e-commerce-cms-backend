import httpStatus from 'http-status';
import mongoose from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { Product } from '../product/product.model';
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

  const result = await Category.create(categoryData);

  return result;
};

const getAllCategories = async (
  storeId: string,
): Promise<ICategory[] | null> => {
  const result = await Category.find({ storeId })
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
  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    const category = await Category.findById(categoryId).session(session);

    if (!category) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Category does not found');
    }

    await Product.deleteMany({ categoryId: category._id }).session(session);

    const result =
      await Category.findByIdAndDelete(categoryId).session(session);

    await session.commitTransaction();

    return result;
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    session.endSession();
  }
};

export const CategoryService = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
