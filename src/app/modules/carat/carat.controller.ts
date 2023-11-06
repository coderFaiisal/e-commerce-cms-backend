import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { CaratService } from './carat.service';
import { ICarat } from './carat.interface';

const createCarat = catchAsync(async (req: Request, res: Response) => {
  const { ...caratData } = req.body;

  const result = await CaratService.createCarat(caratData);

  sendResponse<ICarat>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Carat created successfully',
    data: result,
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
