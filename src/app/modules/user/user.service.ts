/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { SortOrder } from 'mongoose';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IUser } from './user.interface';
import { User } from './user.model';
import { IGenericResponse } from '../../../interfaces/common';

const getAllUsers = async (
  paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<IUser[]>> => {
  //pagination logic
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const result = await User.find({})
    .lean()
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getUserProfile = async (
  user: JwtPayload | null,
): Promise<IUser | null> => {
  const result = await User.findOne({ email: user?.email }).lean();

  return result;
};

const getUserReviews = async (
  user: JwtPayload | null,
): Promise<IUser | null> => {
  const result = await User.findOne({ email: user?.email }, { reviews: 1 });

  return result;
};

const getSingleUser = async (id: string): Promise<IUser | null> => {
  const result = await User.findById(id);

  return result;
};

const updateUserProfile = async (
  user: JwtPayload | null,
  payload: Partial<IUser>,
): Promise<Partial<IUser> | null> => {
  const isExist = await User.findOne({ email: user?.email }).lean();

  if (!isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User does not found!');
  }

  const { password, ...userData } = payload;

  const updatedUserData: Partial<IUser> = { ...userData };
  //hashing password
  if (password) {
    updatedUserData.password = await bcrypt.hash(
      password,
      Number(config.bcrypt_salt_rounds),
    );
  }

  const result = await User.findOneAndUpdate(
    { email: user?.email },
    updatedUserData,
    { new: true },
  );

  return result;
};

const deleteUser = async (id: string): Promise<IUser | null> => {
  const isExist = await User.findById(id).lean();

  if (!isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User is not found!');
  }

  const result = await User.findByIdAndDelete(id);
  return result;
};

export const UserService = {
  getSingleUser,
  getAllUsers,
  getUserProfile,
  getUserReviews,
  updateUserProfile,
  deleteUser,
};
