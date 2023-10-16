import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import { IWishList } from './wishList.interface';
import { WishList } from './wishList.model';

const createWishList = async (payload: IWishList): Promise<IWishList> => {
  const isExist = await WishList.findOne(payload);

  if (isExist) {
    throw new ApiError(httpStatus.CONFLICT, 'Already added');
  }

  const result = (await WishList.create(payload)).populate('productId');
  return result;
};

const getWishList = async (user: JwtPayload | null): Promise<IWishList[]> => {
  const result = await WishList.find({ userEmail: user?.email });
  return result;
};

const getSingleWishList = async (
  user: JwtPayload | null,
  productId: string,
): Promise<IWishList | null> => {
  //check list
  const isListExist = await WishList.findOne({
    userEmail: user?.email,
    productId: productId,
  });

  let result = null;

  if (isListExist) {
    result = isListExist;
  }

  return result;
};

const deleteWishList = async (
  user: JwtPayload | null,
  productId: string,
): Promise<IWishList | null> => {
  //check list
  const isListExist = await WishList.findOne({ productId });

  if (!isListExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Wish item does not found!');
  }

  //check authentic user
  if (isListExist?.userEmail !== user?.email) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized');
  }

  const result = await WishList.findOneAndDelete({ productId });

  return result;
};

export const WishListService = {
  createWishList,
  getWishList,
  getSingleWishList,
  deleteWishList,
};
