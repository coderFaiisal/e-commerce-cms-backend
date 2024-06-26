import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { TGenericResponse } from '../../../types/common';
import QueryBuilder from '../../builder/QueryBuilder';
import { Product } from '../product/model';
import { Store } from '../store/model';
import { User } from '../user/model';
import { Attribute } from './model';
import { TAttribute } from './type';

const createAttribute = async (
  user: JwtPayload | null,
  payload: TAttribute,
): Promise<boolean> => {
  const isUserExist = await User.findOne({ email: user?.email }).lean();

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exist!");
  }

  const isStoreExist = await Store.findById(payload.storeId).lean();

  if (!isStoreExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Store doesn't exist!");
  }

  const userIdString = isUserExist._id.toString();
  const storeUserIdString = isStoreExist.userId.toString();

  if (userIdString !== storeUserIdString) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden access.');
  }

  const isAttributeExist = await Attribute.findOne({
    type: payload.type,
    name: payload.name,
    storeId: payload.storeId,
  }).lean();

  if (isAttributeExist) {
    throw new ApiError(httpStatus.CONFLICT, 'Attribute already exist!');
  }

  await Attribute.create(payload);

  return true;
};

const getAllAttributes = async (
  storeId: string,
  query: Record<string, unknown>,
): Promise<TGenericResponse<TAttribute[]>> => {
  const attributeQuery = new QueryBuilder(Attribute.find({ storeId }), query)
    .search(['type', 'name'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await attributeQuery.modelQuery;

  const { page, limit, total } = await attributeQuery.countTotal();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleAttribute = async (
  attributeId: string,
): Promise<TAttribute | null> => {
  const result = await Attribute.findById(attributeId)
    .populate('storeId')
    .lean();

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Attribute doesn't found.");
  }

  return result;
};

const updateAttribute = async (
  user: JwtPayload | null,
  attributeId: string,
  updatedData: Partial<TAttribute>,
): Promise<boolean> => {
  const isAttributeExist =
    await Attribute.findById(attributeId).populate('storeId');

  if (!isAttributeExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Attribute doesn't exist!");
  }

  const isUserExist = await User.findOne({ email: user?.email }).lean();

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exist!");
  }

  const userIdString = isUserExist._id.toString();
  const storeUserIdString = isAttributeExist.storeId?.userId.toString();

  if (userIdString !== storeUserIdString) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden access.');
  }

  await Attribute.findByIdAndUpdate(attributeId, updatedData);

  return true;
};

const deleteAttribute = async (
  user: JwtPayload | null,
  attributeId: string,
): Promise<boolean> => {
  const isUserExist = await User.findOne({ email: user?.email }).lean();

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exist!");
  }

  const isAttributeExist =
    await Attribute.findById(attributeId).populate('storeId');

  if (!isAttributeExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Attribute doesn't exist!");
  }

  const userIdString = isUserExist._id.toString();
  const storeUserIdString = isAttributeExist.storeId?.userId.toString();

  if (userIdString !== storeUserIdString) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden access.');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    await Product.updateMany(
      {},
      {
        $pull: {
          attributeIds: attributeId,
        },
      },
    ).session(session);

    await Attribute.findByIdAndDelete(attributeId).session(session);

    await session.commitTransaction();
    session.endSession();

    return true;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    throw error;
  }
};

export const AttributeService = {
  createAttribute,
  getAllAttributes,
  getSingleAttribute,
  updateAttribute,
  deleteAttribute,
};
