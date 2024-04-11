import httpStatus from 'http-status';
import { JwtPayload, Secret } from 'jsonwebtoken';
import mongoose from 'mongoose';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { jwtHelper } from '../../../helpers/jwtHelper';
import { Profile, User } from './model';
import {
  TAccessTokenResponse,
  TChangePassword,
  TProfile,
  TSignIn,
  TSignInResponse,
  TSignUp,
  TSignUpResponse,
} from './type';

const signIn = async (payload: TSignIn): Promise<TSignInResponse> => {
  const { email: userEmail, password } = payload;

  const isUserExist = await User.isUserExist(userEmail);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist!');
  }

  const isPasswordMatched = await User.isPasswordMatched(
    password,
    isUserExist?.password as string,
  );

  if (!isPasswordMatched) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect!');
  }

  //create jwt token

  const { email, role } = isUserExist;

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

const signUp = async (payload: TSignUp): Promise<TSignUpResponse> => {
  if (!payload.role) {
    payload.role = 'user';
  }

  const isUserExist = await User.findOne({
    email: payload.email,
  }).lean();

  if (isUserExist) {
    throw new ApiError(httpStatus.CONFLICT, 'User already exist!');
  }

  let user = null;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const userData = {
      email: payload.email,
      password: payload.password,
      role: payload.role,
    };

    user = await User.create([userData], { session });

    const profileData = {
      name: payload.name,
      image: payload.image || '',
      phoneNumber: payload.phoneNumber || '',
      gender: payload.gender || '',
      dob: payload.dob || '',
      userId: user[0]._id,
    };

    await Profile.create([profileData], { session });

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    session.endSession();
  }

  //create jwt token
  const { email, role } = user[0];

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

const createAdmin = async (payload: TSignUp): Promise<string> => {
  if (!payload.role) {
    payload.role = 'admin';
  }

  const isExist = await User.isUserExist(payload.email);

  if (isExist) {
    throw new ApiError(httpStatus.CONFLICT, 'Admin already exist');
  }

  let user = null;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const adminData = {
      email: payload.email,
      password: payload.password,
      role: payload.role,
    };

    user = await User.create([adminData], { session });

    const profileData = {
      name: payload.name,
      image: payload.image || '',
      phoneNumber: payload.phoneNumber || '',
      gender: payload.gender || '',
      dob: payload.dob || '',
      userId: user[0]._id,
    };

    await Profile.create([profileData], { session });

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
  } finally {
    session.endSession();
  }

  return '';
};

const accessToken = async (
  refreshToken: string,
): Promise<TAccessTokenResponse> => {
  const verifiedUser = jwtHelper.verifyToken(
    refreshToken,
    config.jwt.refresh_secret as Secret,
  );

  const { email } = verifiedUser;

  const isUserExist = await User.isUserExist(email);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  const accessToken = jwtHelper.createToken(
    {
      email: isUserExist.email,
      role: isUserExist.role,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );

  return {
    accessToken,
  };
};

const changePassword = async (
  user: JwtPayload | null,
  payload: TChangePassword,
): Promise<boolean> => {
  const { oldPassword, newPassword } = payload;

  const isUserExist = await User.findOne({ email: user?.email });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exist!");
  }

  //check old password
  if (
    isUserExist.password &&
    !(await User.isPasswordMatched(oldPassword, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Old password is incorrect!');
  }

  isUserExist.password = newPassword;

  isUserExist.save();

  return true;
};

const forgotPassword = async (): Promise<void> => {};

const resetPassword = async (): Promise<void> => {};

const getAllUsers = async () => {
  const result = await User.find({}).lean();

  return result;
};

const getAllStoreOwners = async () => {
  const result = await User.find({}).lean();

  return result;
};

const getAllAdmins = async () => {
  const result = await User.find({}).lean();

  return result;
};

const getProfile = async (admin: JwtPayload | null) => {
  const result = await User.findOne({ email: admin?.email }).lean();

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Profile doesn't found");
  }

  return result;
};

const getSingleUser = async (userId: string) => {
  const result = await User.findById(userId).lean();

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't found");
  }

  return result;
};

const updateProfile = async (
  user: JwtPayload | null,
  payload: Partial<TProfile>,
): Promise<Partial<TProfile> | null> => {
  const isExist = await User.findOne({ email: user?.email });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exist");
  }

  const result = await Profile.findOneAndUpdate(
    { email: user?.email },
    payload,
    { new: true },
  );

  return result;
};

const deleteAccount = async (id: string): Promise<boolean> => {
  const isExist = await User.findById(id).lean();

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exist");
  }

  await User.findByIdAndDelete(id);

  return true;
};

export const UserService = {
  signIn,
  signUp,
  createAdmin,
  accessToken,
  changePassword,
  forgotPassword,
  resetPassword,
  getAllUsers,
  getAllStoreOwners,
  getAllAdmins,
  getProfile,
  getSingleUser,
  updateProfile,
  deleteAccount,
};
