import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IBillboard } from './billboard.interface';
import { BillboardService } from './billboard.service';

const createBillboard = catchAsync(async (req: Request, res: Response) => {
  const { ...billboardData } = req.body;

  const result = await BillboardService.createBillboard(billboardData);

  sendResponse<IBillboard>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Billboard created successfully',
    data: result,
  });
});

const getSingleBillboard = catchAsync(async (req: Request, res: Response) => {
  const billboardId = req.params.id;

  const result = await BillboardService.getSingleBillboard(billboardId);

  sendResponse<IBillboard>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Billboard retrieved successfully',
    data: result,
  });
});

const updateBillboard = catchAsync(async (req: Request, res: Response) => {
  const billboardId = req.params.id;
  const { ...updatedData } = req.body;

  const result = await BillboardService.updateBillboard(
    billboardId,
    updatedData,
  );

  sendResponse<IBillboard>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Billboard updated successfully',
    data: result,
  });
});

const deleteBillboard = catchAsync(async (req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Billboard deleted successfully',
    data: null,
  });
});

export const BillboardController = {
  createBillboard,
  getSingleBillboard,
  updateBillboard,
  deleteBillboard,
};
