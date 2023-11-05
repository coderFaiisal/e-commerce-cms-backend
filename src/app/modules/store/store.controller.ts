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

export const StoreController = {
  createStore,
};
