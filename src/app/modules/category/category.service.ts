import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
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
  //! Have to add functionality

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
