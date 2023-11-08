import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import { IProduct, IProductReview } from '../product/product.interface';
import { Product } from '../product/product.model';
import { User } from '../user/user.model';

const createProductReview = async (
  productId: string,
  user: JwtPayload | null,
  reviewData: IProductReview,
): Promise<IProduct | null> => {
  const isProductExist = await Product.isProductExist(productId);

  if (!isProductExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product does not exist');
  }

  const isUserExist = await User.findOne({ email: user?.email }).lean();

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  const review = {
    userName: isUserExist?.name,
    userEmail: isUserExist?.email,
    review: reviewData?.review,
    rating: reviewData?.rating || null,
  };

  const result = await Product.findByIdAndUpdate(
    productId,
    {
      $push: { reviews: review },
    },
    { new: true },
  );

  if (!result) {
    throw new ApiError(httpStatus.NOT_MODIFIED, 'Failed to add product review');
  }

  return result;
};

const updateProductReview = async (
  productId: string,
  user: JwtPayload | null,
  updatedData: Partial<IProductReview>,
): Promise<IProduct | null> => {
  const isProductExist = await Product.isProductExist(productId);

  if (!isProductExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product does not exist');
  }

  const result = await Product.aggregate([
    {
      $match: { _id: productId },
    },
    {
      $addFields: {
        reviews: {
          $map: {
            input: '$reviews',
            as: 'review',
            in: {
              $cond: [
                { $eq: ['$$review.userEmail', user?.email] },
                { $mergeObjects: ['$$review', updatedData] },
                '$$review',
              ],
            },
          },
        },
      },
    },
  ]);

  return result[0];
};

const deleteProductReview = async (
  productId: string,
  user: JwtPayload | null,
): Promise<IProduct | null> => {
  const isProductExist = await Product.isProductExist(productId);

  if (!isProductExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product does not exist');
  }

  const result = await Product.aggregate([
    {
      $match: { _id: productId },
    },
    {
      $addFields: {
        reviews: {
          $filter: {
            input: '$reviews',
            as: 'review',
            cond: { $ne: ['$$review.userEmail', user?.email] },
          },
        },
      },
    },
  ]);

  return result[0];
};

export const ProductReviewService = {
  createProductReview,
  updateProductReview,
  deleteProductReview,
};
