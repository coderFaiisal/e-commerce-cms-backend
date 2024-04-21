import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import { Product } from '../product/model';
import { IProduct, IProductReview } from '../product/type';
import { User } from '../user/model';

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

  return result;
};

const updateProductReview = async (
  productId: string,
  reviewId: string,
  updatedData: Partial<IProductReview>,
): Promise<IProduct | null> => {
  const isProductExist = await Product.isProductExist(productId);

  if (!isProductExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product does not exist');
  }

  const result = await Product.findOneAndUpdate(
    {
      _id: productId,
      'reviews._id': reviewId,
    },
    {
      $set: {
        'reviews.$.review': updatedData.review,
        'reviews.$.rating': updatedData.rating,
      },
    },
    { new: true },
  );

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Failed to update review');
  }

  return result;
};

const deleteProductReview = async (
  productId: string,
  reviewId: string,
): Promise<IProduct | null> => {
  const isProductExist = await Product.isProductExist(productId);

  if (!isProductExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product does not exist');
  }
  const result = await Product.findByIdAndUpdate(
    productId,
    {
      $pull: {
        reviews: {
          _id: reviewId,
        },
      },
    },
    { new: true },
  );

  return result;
};

export const ProductReviewService = {
  createProductReview,
  updateProductReview,
  deleteProductReview,
};
