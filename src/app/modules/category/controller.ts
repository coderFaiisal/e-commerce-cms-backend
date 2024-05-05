import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { CategoryService } from './service';
import { TCategory } from './type';

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  const { ...categoryData } = req.body;

  const result = await CategoryService.createCategory(user, categoryData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category created successfully.',
    data: result,
  });
});

const getAllCategories = catchAsync(async (req: Request, res: Response) => {
  const storeId = req.params.storeId;

  const result = await CategoryService.getAllCategories(storeId);

  sendResponse<TCategory[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Categories retrieved successfully.',
    data: result,
  });
});

const getSingleCategory = catchAsync(async (req: Request, res: Response) => {
  const categoryId = req.params.id;

  const result = await CategoryService.getSingleCategory(categoryId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category retrieved successfully.',
    data: result,
  });
});

const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  const categoryId = req.params.id;

  const { ...updatedData } = req.body;

  const result = await CategoryService.updateCategory(
    user,
    categoryId,
    updatedData,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category updated successfully.',
    data: result,
  });
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  const categoryId = req.params.id;

  const result = await CategoryService.deleteCategory(user, categoryId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category deleted successfully.',
    data: result,
  });
});

export const CategoryController = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
