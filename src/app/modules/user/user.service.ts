/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { IUser } from './user.interface';
import { User } from './user.model';

const getAllUsers = async (): Promise<IUser[]> => {
  const result = await User.find({ role: 'user' });
  return result;
};

const getSingleUser = async (id: string): Promise<IUser | null> => {
  const result = await User.findById(id);
  return result;
};

const getUserProfile = async (
  user: JwtPayload | null,
): Promise<IUser | null> => {
  const result = await User.findOne({ email: user?.email });
  return result;
};

const getUserReviews = async (
  user: JwtPayload | null,
): Promise<IUser | null> => {
  const result = await User.findOne({ email: user?.email }, { reviews: 1 });
  return result;
};

const updateUserProfile = async (
  user: JwtPayload | null,
  payload: Partial<IUser>,
): Promise<Partial<IUser> | null> => {
  const isExist = await User.findOne({ email: user?.email });

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
  const isExist = await User.findById(id);

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