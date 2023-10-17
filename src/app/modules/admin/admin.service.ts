/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { IUser } from '../user/user.interface';
import { User } from '../user/user.model';

const createAdmin = async (payload: IUser): Promise<IUser> => {
  const result = await User.create(payload);
  return result;
};

const getAdminProfile = async (
  user: JwtPayload | null,
): Promise<IUser | null> => {
  const result = await User.findOne({ email: user?.email });
  return result;
};

const updateAdminProfile = async (
  user: JwtPayload | null,
  payload: Partial<IUser>,
): Promise<Partial<IUser> | null> => {
  const isExist = await User.findOne({ email: user?.email });

  if (!isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Admin does not found!');
  }

  const { password, ...adminData } = payload;

  const updatedAdminData: Partial<IUser> = { ...adminData };

  //hashing password
  if (password) {
    updatedAdminData.password = await bcrypt.hash(
      password,
      Number(config.bcrypt_salt_rounds),
    );
  }

  const result = await User.findOneAndUpdate(
    { email: user?.email },
    updatedAdminData,
    { new: true },
  );

  return result;
};

export const AdminService = {
  createAdmin,
  getAdminProfile,
  updateAdminProfile,
};
