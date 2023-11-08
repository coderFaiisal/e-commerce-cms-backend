/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { JwtPayload, Secret } from 'jsonwebtoken';
import { SortOrder } from 'mongoose';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { jwtHelper } from '../../../helpers/jwtHelper';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import {
  IChangePassword,
  IGenericResponse,
  IRefreshTokenResponse,
  ISignIn,
  ISignInResponse,
} from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IAdmin } from './admin.interface';
import { Admin } from './admin.model';

const createAdmin = async (admin: IAdmin): Promise<IAdmin> => {
  //set role
  admin.role = 'admin';

  const isAdminExist = await Admin.isAdminExist(admin?.email);

  if (isAdminExist) {
    throw new ApiError(httpStatus.CONFLICT, 'Admin already exist');
  }

  const result = await Admin.create(admin);

  return result;
};

const signInAdmin = async (payload: ISignIn): Promise<ISignInResponse> => {
  const { email: adminEmail, password } = payload;

  //check admin
  const isAdminExist = await Admin.isAdminExist(adminEmail);

  if (!isAdminExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Admin does not exist');
  }

  //check password
  const isPasswordMatched = await Admin.isPasswordMatched(
    password,
    isAdminExist?.password as string,
  );

  if (!isPasswordMatched) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }

  //create jwt token
  const { email, role } = isAdminExist;

  const accessToken = jwtHelper.createToken(
    {
      email,
      role,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );

  const refreshToken = jwtHelper.createToken(
    {
      email,
      role,
    },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const changePassword = async (
  admin: JwtPayload | null,
  payload: IChangePassword,
): Promise<void> => {
  const { oldPassword, newPassword } = payload;

  //check admin
  const isAdminExist = await Admin.findOne({ email: admin?.email }).select(
    '+password',
  );

  if (!isAdminExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Admin does not exist');
  }

  //check old password
  if (
    isAdminExist.password &&
    !(await Admin.isPasswordMatched(oldPassword, isAdminExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Old password is incorrect!');
  }

  //set new password
  isAdminExist.password = newPassword;

  // updating using save()
  isAdminExist.save();
};

const refreshToken = async (
  payload: string,
): Promise<IRefreshTokenResponse> => {
  let verifiedAdmin = null;

  try {
    verifiedAdmin = jwtHelper.verifyToken(
      payload,
      config.jwt.refresh_secret as Secret,
    );
  } catch (error) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token!');
  }

  const { email, role } = verifiedAdmin;

  const isAdminExist = await Admin.isAdminExist(email);

  if (!isAdminExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Admin does not exist');
  }

  const accessToken = jwtHelper.createToken(
    {
      email,
      role,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );

  return {
    accessToken,
  };
};

const getAllAdmins = async (
  paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<IAdmin[]>> => {
  //pagination logic
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const result = await Admin.find({})
    .lean()
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Admin.countDocuments();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getAdminProfile = async (
  admin: JwtPayload | null,
): Promise<IAdmin | null> => {
  const result = await Admin.findOne({ email: admin?.email }).lean();

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Admin profile not found');
  }

  return result;
};

const getSingleAdmin = async (adminId: string): Promise<IAdmin | null> => {
  const result = await Admin.findById(adminId).lean();

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Admin does not found');
  }

  return result;
};

const updateAdminProfile = async (
  admin: JwtPayload | null,
  payload: Partial<IAdmin>,
): Promise<Partial<IAdmin> | null> => {
  const isExist = await Admin.findOne({ email: admin?.email });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Admin does not exist');
  }

  const { password, ...adminData } = payload;

  const updatedAdminData: Partial<IAdmin> = { ...adminData };

  //hashing password
  if (password) {
    updatedAdminData.password = await bcrypt.hash(
      password,
      Number(config.bcrypt_salt_rounds),
    );
  }

  const result = await Admin.findOneAndUpdate(
    { email: admin?.email },
    updatedAdminData,
    { new: true },
  );

  return result;
};

const deleteAdmin = async (adminId: string): Promise<IAdmin | null> => {
  const result = await Admin.findByIdAndDelete(adminId).lean();

  return result;
};

export const AdminService = {
  createAdmin,
  signInAdmin,
  changePassword,
  refreshToken,
  getAllAdmins,
  getAdminProfile,
  getSingleAdmin,
  updateAdminProfile,
  deleteAdmin,
};
