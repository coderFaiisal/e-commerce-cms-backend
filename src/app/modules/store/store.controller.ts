import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IStore } from './store.interface';
import { StoreService } from './store.service';

const createStore = catchAsync(async (req: Request, res: Response) => {
  const { ...storeData } = req.body;

  const result = await StoreService.createStore(storeData);

  sendResponse<IStore>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Store created successfully',
    data: result,
  });
});

const isStoreExist = catchAsync(async (req: Request, res: Response) => {
  const result = await StoreService.isStoreExist();

  sendResponse<boolean>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Store info retrieved successfully',
    data: result,
  });
});

const getSingleStore = catchAsync(async (req: Request, res: Response) => {
  const storeId = req.params.id;

  const result = await StoreService.getSingleStore(storeId);

  sendResponse<IStore>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Store retrieved successfully',
    data: result,
  });
});

const updateStore = catchAsync(async (req: Request, res: Response) => {
  const storeId = req.params.id;

  const { ...updatedData } = req.body;

  const result = await StoreService.updateStore(storeId, updatedData);

  sendResponse<IStore>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Store updated successfully',
    data: result,
  });
});

const deleteStore = catchAsync(async (req: Request, res: Response) => {
  const storeId = req.params.id;

  const result = await StoreService.deleteStore(storeId);

  sendResponse<IStore>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Store deleted successfully',
    data: result,
  });
});

export const StoreController = {
  createStore,
  isStoreExist,
  getSingleStore,
  updateStore,
  deleteStore,
};
