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
  IAdminSignUpResponse,
  IGenericResponse,
  IRefreshTokenResponse,
  ISignIn,
  ISignInResponse,
} from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IAdmin } from './admin.interface';
import { Admin } from './admin.model';

const createAdmin = async (admin: IAdmin): Promise<IAdminSignUpResponse> => {
  //set role
  admin.role = 'admin';

  const isAdminExist = await Admin.isAdminExist(admin?.email);

  if (isAdminExist) {
    throw new ApiError(httpStatus.CONFLICT, 'Admin already exist!');
  }

  const createdAdmin = await Admin.create(admin);

  // create jwt token
  const { email, role } = createdAdmin;

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
    createdAdmin,
    accessToken,
    refreshToken,
  };
};

const signInAdmin = async (payload: ISignIn): Promise<ISignInResponse> => {
  const { email: adminEmail, password } = payload;

  //check admin
  const isAdminExist = await Admin.isAdminExist(adminEmail);

  if (!isAdminExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Admin does not exist!');
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
    throw new ApiError(httpStatus.NOT_FOUND, 'Admin does not exist!');
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
    throw new ApiError(httpStatus.NOT_FOUND, 'Profile not found!');
  }

  return result;
};

const getSingleAdmin = async (adminId: string): Promise<IAdmin | null> => {
  const result = await Admin.findById(adminId).lean();

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Admin not found!');
  }

  return result;
};

const updateAdminProfile = async (
  admin: JwtPayload | null,
  payload: Partial<IAdmin>,
): Promise<Partial<IAdmin> | null> => {
  const isExist = await Admin.findOne({ email: admin?.email });

  if (!isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Admin does not found!');
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
  refreshToken,
  getAllAdmins,
  getAdminProfile,
  getSingleAdmin,
  updateAdminProfile,
  deleteAdmin,
};
