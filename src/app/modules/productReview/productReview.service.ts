import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import { IProduct, IProductReview } from '../product/product.interface';
import { Product } from '../product/product.model';

const createProductReview = async (
  productId: string,
  user: JwtPayload | null,
  reviewData: IProductReview[],
): Promise<IProduct | null> => {
  const isProductExist = await Product.isProductExist(productId);

  if (!isProductExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product does not found!');
  }

  console.log(user, reviewData);
  return null;
};

const updateProductReview = async (
  productId: string,
  user: JwtPayload | null,
  updatedData: Partial<IProductReview>,
): Promise<IProduct | null> => {
  const isProductExist = await Product.isProductExist(productId);

  if (!isProductExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product does not found!');
  }

  console.log(user, updatedData);
  return null;
};

const deleteProductReview = async (
  productId: string,
  user: JwtPayload | null,
): Promise<IProduct | null> => {
  const isProductExist = await Product.isProductExist(productId);

  if (!isProductExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product does not found!');
  }

  console.log(user);
  return null;
};

export const ProductReviewService = {
  createProductReview,
  updateProductReview,
  deleteProductReview,
};
