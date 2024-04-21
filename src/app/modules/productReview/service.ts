import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import { TGenericResponse } from '../../../types/common';
import QueryBuilder from '../../builder/QueryBuilder';
import { Product } from '../product/model';
import { User } from '../user/model';
import { ProductReview } from './model';
import { TProductReview } from './type';

const createProductReview = async (
  user: JwtPayload | null,
  payload: TProductReview,
): Promise<boolean> => {
  const isProductExist = await Product.findById(payload.productId).lean();

  if (!isProductExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product doesn't exist!");
  }

  const isUserExist = await User.findOne({ email: user?.email }).lean();

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Sign in please.');
  }

  const isAlreadyReviewed = await ProductReview.findOne({
    rating: payload.rating,
    productId: payload.productId,
    userId: isUserExist._id,
  });

  if (isAlreadyReviewed) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Already post a review.');
  }

  payload.userId = isUserExist._id;

  await ProductReview.create(payload);

  return true;
};

const getAllProductReviews = async (
  productId: string,
  query: Record<string, unknown>,
): Promise<TGenericResponse<TProductReview[]>> => {
  const isProductExist = await Product.findById(productId).lean();

  if (!isProductExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product doesn't exist!");
  }

  const productReviewQuery = new QueryBuilder(
    ProductReview.find({ productId }),
    query,
  )
    .search(['message'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await productReviewQuery.modelQuery;

  const { page, limit, total } = await productReviewQuery.countTotal();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};
const updateProductReview = async (
  user: JwtPayload | null,
  productReviewId: string,
  payload: Partial<TProductReview>,
): Promise<boolean> => {
  const isProductReviewExist =
    await ProductReview.findById(productReviewId).lean();

  if (!isProductReviewExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product review doesn't exist!");
  }

  const isUserExist = await User.findOne({ email: user?.email }).lean();

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exist!");
  }

  const userIdString = isUserExist._id.toString();
  const productReviewUserIdString = isProductReviewExist.userId?.toString();

  if (userIdString !== productReviewUserIdString) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden access.');
  }

  await ProductReview.findByIdAndUpdate(productReviewId, payload);

  return true;
};

const deleteProductReview = async (
  user: JwtPayload | null,
  productReviewId: string,
): Promise<boolean> => {
  const isProductReviewExist =
    await ProductReview.findById(productReviewId).lean();

  if (!isProductReviewExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product review doesn't exist!");
  }

  const isUserExist = await User.findOne({ email: user?.email }).lean();

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exist!");
  }

  const userIdString = isUserExist._id.toString();
  const productReviewUserIdString = isProductReviewExist.userId?.toString();

  if (userIdString !== productReviewUserIdString) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden access.');
  }

  await ProductReview.findByIdAndDelete(productReviewId);

  return true;
};

export const ProductReviewService = {
  createProductReview,
  getAllProductReviews,
  updateProductReview,
  deleteProductReview,
};
