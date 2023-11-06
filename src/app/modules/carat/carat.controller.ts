import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';

const createCarat = catchAsync(async (req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Carat created successfully',
    data: null,
  });
});

const getAllCarats = catchAsync(async (req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Carat created successfully',
    data: null,
  });
});

const getSingleCarat = catchAsync(async (req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Carat created successfully',
    data: null,
  });
});

const updateCarat = catchAsync(async (req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Carat created successfully',
    data: null,
  });
});

const deleteCarat = catchAsync(async (req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Carat created successfully',
    data: null,
  });
});

export const CaratController = {
  createCarat,
  getAllCarats,
  getSingleCarat,
  updateCarat,
  deleteCarat,
};
