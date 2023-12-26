import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { IBanner } from './banner.interface';
import { Banner } from './banner.model';

const createBanner = async (bannerData: IBanner): Promise<IBanner | null> => {
  const isBannerExist = await Banner.findOne({
    label: bannerData.label,
  }).lean();

  if (isBannerExist) {
    throw new ApiError(httpStatus.CONFLICT, 'Banner already exist');
  }

  const result = await Banner.create(bannerData);

  return result;
};

const getAllBanners = async (storeId: string): Promise<IBanner[] | null> => {
  const result = await Banner.find({ storeId }).populate('storeId').lean();

  return result;
};

const getSingleBanner = async (bannerId: string): Promise<IBanner | null> => {
  const result = await Banner.findById(bannerId).populate('storeId').lean();

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Banner does not found');
  }

  return result;
};

const updateBanner = async (
  bannerId: string,
  updatedData: Partial<IBanner>,
): Promise<IBanner | null> => {
  const result = await Banner.findByIdAndUpdate(bannerId, updatedData, {
    new: true,
  })
    .populate('storeId')
    .lean();

  if (!result) {
    throw new ApiError(httpStatus.NOT_MODIFIED, 'Failed to update banner');
  }

  return result;
};

const deleteBanner = async (bannerId: string): Promise<IBanner | null> => {
  const banner = await Banner.findById(bannerId).lean();

  if (!banner) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Banner does not found');
  }

  const result = await Banner.findByIdAndDelete(bannerId);

  return result;
};

export const BannerService = {
  createBanner,
  getAllBanners,
  getSingleBanner,
  updateBanner,
  deleteBanner,
};
