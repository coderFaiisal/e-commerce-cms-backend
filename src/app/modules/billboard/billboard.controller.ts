import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';

const createBillboard = catchAsync(async (req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Billboard created successfully',
    data: null,
  });
});

const getSingleBillboard = catchAsync(async (req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Billboard created successfully',
    data: null,
  });
});

const updateBillboard = catchAsync(async (req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Billboard created successfully',
    data: null,
  });
});

const deleteBillboard = catchAsync(async (req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Billboard created successfully',
    data: null,
  });
});

export const BillboardController = {
  createBillboard,
  getSingleBillboard,
  updateBillboard,
  deleteBillboard,
};
