import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ICarat } from './carat.interface';
import { CaratService } from './carat.service';

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
  const result = await CaratService.getAllCarats();

  sendResponse<ICarat[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Carats retrieved successfully',
    data: result,
  });
});

const getSingleCarat = catchAsync(async (req: Request, res: Response) => {
  const caratId = req.params.id;

  const result = await CaratService.getSingleCarat(caratId);

  sendResponse<ICarat>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Carat retrieved successfully',
    data: result,
  });
});

const updateCarat = catchAsync(async (req: Request, res: Response) => {
  const caratId = req.params.id;

  const { ...updatedData } = req.body;

  const result = await CaratService.updateCarat(caratId, updatedData);

  sendResponse<ICarat>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Carat updated successfully',
    data: result,
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
