import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IWishList } from './wishList.interface';
import { WishListService } from './wishList.service';

const createWishList = catchAsync(async (req: Request, res: Response) => {
  const { ...wishListData } = req.body;

  const result = await WishListService.createWishList(wishListData);

  sendResponse<IWishList>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product successfully added into wish list',
    data: result,
  });
});

const getWishList = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  const result = await WishListService.getWishList(user);

  sendResponse<IWishList[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Wish lists retrieved successfully',
    data: result,
  });
});

const getSingleWishList = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const ProductId = req.params.id;

  const result = await WishListService.getSingleWishList(user, ProductId);

  sendResponse<IWishList>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Wish list retrieved successfully',
    data: result,
  });
});

const deleteWishList = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const ProductId = req.params.id;

  const result = await WishListService.deleteWishList(user, ProductId);

  sendResponse<IWishList>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Wish list delete successfully',
    data: result,
  });
});

export const WishListController = {
  createWishList,
  getWishList,
  deleteWishList,
  getSingleWishList,
};
