import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { IBillboard } from './billboard.interface';
import { Billboard } from './billboard.model';

const createBillboard = async (
  billboardData: IBillboard,
): Promise<IBillboard | null> => {
  const isBillboardExist = await Billboard.findOne({
    label: billboardData.label,
  }).lean();

  if (isBillboardExist) {
    throw new ApiError(httpStatus.CONFLICT, 'Billboard already exist');
  }

  const result = await Billboard.create(billboardData);

  return result;
};

const getSingleBillboard = async (
  billboardId: string,
): Promise<IBillboard | null> => {
  const result = await Billboard.findById(billboardId)
    .populate('storeId')
    .lean();

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Billboard does not found');
  }

  return result;
};

const updateBillboard = async (
  billboardId: string,
  updatedData: Partial<IBillboard>,
): Promise<IBillboard | null> => {
  const result = await Billboard.findByIdAndUpdate(billboardId, updatedData, {
    new: true,
  })
    .populate('storeId')
    .lean();

  if (!result) {
    throw new ApiError(httpStatus.NOT_MODIFIED, 'Failed to update billboard');
  }

  return result;
};

const deleteBillboard = async (
  billboardId: string,
): Promise<IBillboard | null> => {
  const billboard = await Billboard.findById(billboardId).lean();

  if (!billboard) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Billboard does not found');
  }

  const result = await Billboard.findByIdAndDelete(billboardId);

  return result;
};

export const BillboardService = {
  createBillboard,
  getSingleBillboard,
  updateBillboard,
  deleteBillboard,
};

// billboardId
// storeId
// categoriesId = []
// productsId = [] with aggregate

// billboard, categories, products wiil be delete from store collection.
// categories will be delete from category collection
// products will be delete from product collection
// products will be delete from carat collection.
// products will be delete from material collection.
// billboard will be delete from billboard collection
