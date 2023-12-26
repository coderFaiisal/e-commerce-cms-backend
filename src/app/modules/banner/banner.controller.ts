import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IBanner } from './banner.interface';
import { BannerService } from './banner.service';

const createBanner = catchAsync(async (req: Request, res: Response) => {
  const { ...bannerData } = req.body;

  const result = await BannerService.createBanner(bannerData);

  sendResponse<IBanner>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Banner created successfully',
    data: result,
  });
});

const getAllBanners = catchAsync(async (req: Request, res: Response) => {
  const { storeId } = req.params;
  const result = await BannerService.getAllBanners(storeId);

  sendResponse<IBanner[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Banners retrieved successfully',
    data: result,
  });
});

const getSingleBanner = catchAsync(async (req: Request, res: Response) => {
  const bannerId = req.params.id;

  const result = await BannerService.getSingleBanner(bannerId);

  sendResponse<IBanner>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Banner retrieved successfully',
    data: result,
  });
});

const updateBanner = catchAsync(async (req: Request, res: Response) => {
  const bannerId = req.params.id;
  const { ...updatedData } = req.body;

  const result = await BannerService.updateBanner(bannerId, updatedData);

  sendResponse<IBanner>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Banner updated successfully',
    data: result,
  });
});

const deleteBanner = catchAsync(async (req: Request, res: Response) => {
  const bannerId = req.params.id;

  const result = await BannerService.deleteBanner(bannerId);

  sendResponse<IBanner>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Banner deleted successfully',
    data: result,
  });
});

export const BannerController = {
  createBanner,
  getAllBanners,
  getSingleBanner,
  updateBanner,
  deleteBanner,
};
