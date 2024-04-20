import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import { Category } from '../category/model';
import { Store } from '../store/model';
import { User } from '../user/model';
import { Billboard } from './model';
import { TBillboard } from './type';

const createBillboard = async (
  user: JwtPayload | null,
  payload: TBillboard,
): Promise<boolean> => {
  const isUserExist = await User.findOne({ email: user?.email }).lean();

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exist!");
  }

  const isStoreExist = await Store.findById(payload.storeId).lean();

  if (!isStoreExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Store doesn't exist!");
  }

  const isCategoryExist = await Category.findById(payload.categoryId).lean();

  if (!isCategoryExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Categoryt doesn't exist!");
  }

  const userIdString = isUserExist._id.toString();
  const storeUserIdString = isStoreExist.userId.toString();

  if (userIdString !== storeUserIdString) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden access.');
  }

  const isBillboardExist = await Billboard.findOne({
    label: payload.label,
    storeId: payload.storeId,
  }).lean();

  if (isBillboardExist) {
    throw new ApiError(httpStatus.CONFLICT, 'Billboard already exist!');
  }

  await Billboard.create(payload);

  return true;
};

const getAllBillboards = async (
  storeId: string,
): Promise<TBillboard[] | null> => {
  const result = await Billboard.find({ storeId }).populate('storeId').lean();

  return result;
};

const getSingleBillboard = async (
  billboardId: string,
): Promise<TBillboard | null> => {
  const result = await Billboard.findById(billboardId).populate('categoryId');

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Billboard doesn't found.");
  }

  return result;
};

const updateBillboard = async (
  user: JwtPayload | null,
  billboardId: string,
  updatedData: Partial<TBillboard>,
): Promise<boolean> => {
  const isBillboardExist =
    await Billboard.findById(billboardId).populate('storeId');

  if (!isBillboardExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Billboard doesn't exist!");
  }

  const isUserExist = await User.findOne({ email: user?.email }).lean();

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exist!");
  }

  const userIdString = isUserExist._id.toString();
  const storeUserIdString = isBillboardExist.storeId?.userId.toString();

  if (userIdString !== storeUserIdString) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden access.');
  }

  await Billboard.findByIdAndUpdate(billboardId, updatedData);

  return true;
};

const deleteBillboard = async (
  user: JwtPayload | null,
  billboardId: string,
): Promise<boolean> => {
  const isBillboardExist =
    await Billboard.findById(billboardId).populate('storeId');

  if (!isBillboardExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Billboard doesn't exist!");
  }

  const isUserExist = await User.findOne({ email: user?.email }).lean();

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exist!");
  }

  const userIdString = isUserExist._id.toString();
  const storeUserIdString = isBillboardExist.storeId?.userId.toString();

  if (userIdString !== storeUserIdString) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden access.');
  }

  await Billboard.findByIdAndDelete(billboardId);

  return true;
};

export const BillboardService = {
  createBillboard,
  getAllBillboards,
  getSingleBillboard,
  updateBillboard,
  deleteBillboard,
};
