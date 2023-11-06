import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IMaterial } from './material.interface';
import { MaterialService } from './material.service';

const createMaterial = catchAsync(async (req: Request, res: Response) => {
  const { ...materialData } = req.body;

  const result = await MaterialService.createMaterial(materialData);

  sendResponse<IMaterial>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Material created successfully',
    data: result,
  });
});

const getAllMaterials = catchAsync(async (req: Request, res: Response) => {
  const result = await MaterialService.getAllMaterials();

  sendResponse<IMaterial[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Materials retrieved successfully',
    data: result,
  });
});

const getSingleMaterial = catchAsync(async (req: Request, res: Response) => {
  const materialId = req.params.id;

  const result = await MaterialService.getSingleMaterial(materialId);

  sendResponse<IMaterial>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Material retrieved successfully',
    data: result,
  });
});

const updateMaterial = catchAsync(async (req: Request, res: Response) => {
  const materialId = req.params.id;

  const { ...updatedData } = req.body;

  const result = await MaterialService.updateMaterial(materialId, updatedData);

  sendResponse<IMaterial>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Material updated successfully',
    data: result,
  });
});

const deleteMaterial = catchAsync(async (req: Request, res: Response) => {
  const materialId = req.params.id;

  const result = await MaterialService.deleteMaterial(materialId);

  sendResponse<IMaterial>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Material deleted successfully',
    data: result,
  });
});

export const MaterialController = {
  createMaterial,
  getAllMaterials,
  getSingleMaterial,
  updateMaterial,
  deleteMaterial,
};
