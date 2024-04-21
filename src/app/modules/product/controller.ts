import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ProductService } from './service';
import { TProduct } from './type';

const createProduct = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  const { ...productData } = req.body;

  const result = await ProductService.createProduct(user, productData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product created successfully.',
    data: result,
  });
});

const getAllProducts = catchAsync(async (req: Request, res: Response) => {
  const storeId = req.params.storeId;

  const query = req.query;

  const result = await ProductService.getAllProducts(storeId, query);

  sendResponse<TProduct[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Products retrieved successfully.',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleProduct = catchAsync(async (req: Request, res: Response) => {
  const productId = req.params.id;

  const result = await ProductService.getSingleProduct(productId);

  sendResponse<TProduct>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product retrieved successfully.',
    data: result,
  });
});

const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  const productId = req.params.id;

  const { ...updatedData } = req.body;

  const result = await ProductService.updateProduct(
    user,
    productId,
    updatedData,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product updated successfully.',
    data: result,
  });
});

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  const productId = req.params.id;

  const result = await ProductService.deleteProduct(user, productId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product deleted successfully.',
    data: result,
  });
});

export const ProductController = {
  createProduct,
  getSingleProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
};
