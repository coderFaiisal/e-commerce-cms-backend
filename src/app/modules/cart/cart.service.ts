import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import { ICart } from './cart.interface';
import { Cart } from './cart.model';

const createCart = async (payload: ICart): Promise<ICart> => {
  const result = await Cart.create(payload);
  return result;
};

const getCarts = async (user: JwtPayload | null): Promise<ICart[]> => {
  const result = await Cart.find({ userEmail: user?.email });
  return result;
};

const updateCart = async (
  user: JwtPayload | null,
  cartId: string,
  payload: Partial<ICart>,
): Promise<ICart | null> => {
  //check list
  const isCartExist = await Cart.findById(cartId);

  if (!isCartExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Reading item does not found!');
  }

  //check authentic user
  if (isCartExist?.userEmail !== user?.email) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized');
  }

  const result = await Cart.findByIdAndUpdate(cartId, payload, {
    new: true,
  });

  return result;
};

const deleteCart = async (
  user: JwtPayload | null,
  cartId: string,
): Promise<ICart | null> => {
  //check list
  const isCartExist = await Cart.findOne({ cartId });

  if (!isCartExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Reading item does not found!');
  }

  //check authentic user
  if (isCartExist?.userEmail !== user?.email) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized');
  }

  const result = await Cart.findOneAndDelete({ cartId });

  return result;
};

export const CartService = {
  createCart,
  getCarts,
  updateCart,
  deleteCart,
};
