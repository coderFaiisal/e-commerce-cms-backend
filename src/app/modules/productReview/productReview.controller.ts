import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IProduct } from '../product/product.interface';
import { ProductReviewService } from './productReview.service';

const createProductReview = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const productId = req.params.id;
  const { ...reviewData } = req.body;

  const result = await ProductReviewService.createProductReview(
    productId,
    user,
    reviewData,
  );

  sendResponse<IProduct>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review added successfully',
    data: result,
  });
});

const updateProductReview = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const productId = req.params.id;
  const { ...updatedData } = req.body;

  const result = await ProductReviewService.updateProductReview(
    productId,
    user,
    updatedData,
  );

  sendResponse<IProduct>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review updated successfully',
    data: result,
  });
});

const deleteProductReview = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const productId = req.params.id;

  const result = await ProductReviewService.deleteProductReview(
    productId,
    user,
  );

  sendResponse<IProduct>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review deleted successfully',
    data: result,
  });
});

export const ProductReviewController = {
  createProductReview,
  updateProductReview,
  deleteProductReview,
};
