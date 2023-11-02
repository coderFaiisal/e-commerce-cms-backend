/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { jwtHelper } from '../../../helpers/jwtHelper';
import {
  IAdminSignUpResponse,
  IRefreshTokenResponse,
  ISignIn,
  ISignInResponse,
} from '../../../interfaces/common';
import { IUser } from '../user/user.interface';
import { User } from '../user/user.model';
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
  signInAdmin,
  refreshToken,
  getAdminProfile,
  updateAdminProfile,
};
