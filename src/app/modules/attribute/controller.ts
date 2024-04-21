import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AttributeService } from './service';

const createAttribute = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  const { ...attributeData } = req.body;

  const result = await AttributeService.createAttribute(user, attributeData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Attribute created successfully.',
    data: result,
  });
});

const getAllAttributes = catchAsync(async (req: Request, res: Response) => {
  const storeId = req.params.storeId;

  const result = await AttributeService.getAllAttributes(storeId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Attributes retrieved successfully.',
    data: result,
  });
});

const getSingleAttribute = catchAsync(async (req: Request, res: Response) => {
  const attributeId = req.params.id;

  const result = await AttributeService.getSingleAttribute(attributeId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Attribute retrieved successfully.',
    data: result,
  });
});

const updateAttribute = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  const attributeId = req.params.id;

  const { ...updatedData } = req.body;

  const result = await AttributeService.updateAttribute(
    user,
    attributeId,
    updatedData,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Attribute updated successfully.',
    data: result,
  });
});

const deleteAttribute = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  const attributeId = req.params.id;

  const result = await AttributeService.deleteAttribute(user, attributeId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Attribute deleted successfully.',
    data: result,
  });
});

export const AttributeController = {
  createAttribute,
  getAllAttributes,
  getSingleAttribute,
  updateAttribute,
  deleteAttribute,
};
