import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StoreService } from './service';
import { TStore } from './type';

const createStore = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  const { ...storeData } = req.body;

  const result = await StoreService.createStore(user, storeData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Store created successfully.',
    data: result,
  });
});

const isStoreExist = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  const result = await StoreService.isStoreExist(user);

  sendResponse<TStore>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Store retrieved successfully.',
    data: result,
  });
});

const getAllStores = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  const result = await StoreService.getAllStores(user);

  sendResponse<TStore[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Stores retrieved successfully.',
    data: result,
  });
});

const getSingleStore = catchAsync(async (req: Request, res: Response) => {
  const storeId = req.params.id;

  const result = await StoreService.getSingleStore(storeId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Store retrieved successfully.',
    data: result,
  });
});

const updateStore = catchAsync(async (req: Request, res: Response) => {
  const storeId = req.params.id;

  const user = req.user;

  const { ...updatedData } = req.body;

  const result = await StoreService.updateStore(storeId, user, updatedData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Store updated successfully.',
    data: result,
  });
});

const deleteStore = catchAsync(async (req: Request, res: Response) => {
  const storeId = req.params.id;

  const user = req.user;

  const result = await StoreService.deleteStore(storeId, user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Store deleted successfully.',
    data: result,
  });
});

export const StoreController = {
  createStore,
  isStoreExist,
  getAllStores,
  getSingleStore,
  updateStore,
  deleteStore,
};
