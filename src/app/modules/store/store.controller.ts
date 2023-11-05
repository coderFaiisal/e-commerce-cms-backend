import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';

const createStore = catchAsync(async (req: Request, res: Response) => {
  // const {...storeData} = req.body;

  // const result = await StoreService.createStore(storeData)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Store created successfully',
    data: null,
  });
});

export const StoreController = {
  createStore,
};
