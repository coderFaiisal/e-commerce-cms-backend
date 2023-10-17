import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ICart } from './cart.interface';
import { CartService } from './cart.service';

const createCart = catchAsync(async (req: Request, res: Response) => {
  const { ...CartData } = req.body;

  const result = await CartService.createCart(CartData);

  sendResponse<ICart>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Products successfully added into cart',
    data: result,
  });
});

const getCarts = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  const result = await CartService.getCarts(user);

  sendResponse<ICart[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'carts retrieved successfully',
    data: result,
  });
});

const updateCart = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const cartId = req.params.id;
  const { ...updatedData } = req.body;

  const result = await CartService.updateCart(user, cartId, updatedData);

  sendResponse<ICart>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'cart status updated successfully',
    data: result,
  });
});

const deleteCart = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const cartId = req.params.id;

  const result = await CartService.deleteCart(user, cartId);

  sendResponse<ICart>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'cart delete successfully',
    data: result,
  });
});

export const CartController = {
  createCart,
  getCarts,
  updateCart,
  deleteCart,
};
