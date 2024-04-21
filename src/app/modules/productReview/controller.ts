import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ProductReviewService } from './service';

const createProductReview = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  const { ...productReviewData } = req.body;

  const result = await ProductReviewService.createProductReview(
    user,
    productReviewData,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review added successfully.',
    data: result,
  });
});

const getAllProductReviews = catchAsync(async (req: Request, res: Response) => {
  const productId = req.params.productId;

  const query = req.query;

  const result = await ProductReviewService.getAllProductReviews(
    productId,
    query,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Reviews retrieved successfully.',
    data: result.data,
    meta: result.meta,
  });
});

const updateProductReview = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  const productReviewId = req.params.id;

  const { ...updatedData } = req.body;

  const result = await ProductReviewService.updateProductReview(
    user,
    productReviewId,
    updatedData,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review updated successfully.',
    data: result,
  });
});

const deleteProductReview = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  const productReviewId = req.params.id;

  const result = await ProductReviewService.deleteProductReview(
    user,
    productReviewId,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review deleted successfully.',
    data: result,
  });
});

export const ProductReviewController = {
  createProductReview,
  getAllProductReviews,
  updateProductReview,
  deleteProductReview,
};
