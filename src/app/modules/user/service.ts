import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { JwtPayload, Secret } from 'jsonwebtoken';
import mongoose from 'mongoose';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { jwtHelper } from '../../../helpers/jwtHelper';
import { sendEmail } from '../../../shared/sendEmail';
import QueryBuilder from '../../builder/QueryBuilder';
import { UserSearchableFields } from './constant';
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

const forgotPassword = async (payload: string): Promise<boolean> => {
  const user = await User.findOne(
    { email: payload },
    { email: 1, password: 1 },
  ).lean();

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User doesn't exist!");
  }

  const passwordResetToken = jwtHelper.createResetToken(
    {
      email: user.email,
      role: user.role,
    },
    config.jwt.secret as Secret,
    config.jwt.reset_pass_expires_in as string,
  );

  const passwordResetLink: string =
    config.resetlink + `token=${passwordResetToken}`;

  await sendEmail(
    user.email,
    'RESET YOUR PASSWORD',
    `
 <html>
 <head><title>Reset Your Account Password.</title></head>
 <body>
 <h1>Hi, ${user.email}</h1>
 <div>
     <p>Your password reset link is here: <a href=${passwordResetLink}>Click here...</a></p>
     <p>Thank you</p>
  </div>
 </body>
 </html>
 `,
  );

  return true;
};

const resetPassword = async (
  token: string,
  payload: { email: string; newPassword: string },
): Promise<boolean> => {
  const { email, newPassword } = payload;

  const user = await User.findOne({ email }, { email: 1 });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't found!");
  }

  jwtHelper.verifyToken(token, config.jwt.secret as Secret);

  const password = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await User.updateOne({ email }, { password });

  return true;
};

const getAllUsers = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(User.find({ role: 'user' }), query)
    .search(UserSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await userQuery.modelQuery;
  const { page, limit, total } = await userQuery.countTotal();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getAllStoreOwners = async (query: Record<string, unknown>) => {
  const storeOwnerQuery = new QueryBuilder(
    User.find({ role: 'store-owner' }),
    query,
  )
    .search(UserSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await storeOwnerQuery.modelQuery;
  const { page, limit, total } = await storeOwnerQuery.countTotal();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getAllAdmins = async (query: Record<string, unknown>) => {
  const adminQuery = new QueryBuilder(User.find({ role: 'admin' }), query)
    .search(UserSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await adminQuery.modelQuery;
  const { page, limit, total } = await adminQuery.countTotal();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getProfile = async (user: JwtPayload | null) => {
  const isUserExist = await User.findOne({ email: user?.email }, { _id: 1 });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't found");
  }

  const profile = await Profile.findOne({ userId: isUserExist._id }).populate(
    'userId',
  );

  return profile;
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
): Promise<boolean> => {
  const isUserExist = await User.findOne({ email: user?.email }).lean();

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exist!");
  }

  const result = await Profile.findOneAndUpdate(
    { email: user?.email },
    payload,
    { new: true },
  );

  console.log(result);

  return true;
};

const deleteAccount = async (userId: string): Promise<boolean> => {
  const isUserExist = await User.findById(userId, { _id: 1 }).lean();

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exist!");
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    await User.findByIdAndDelete(userId).session(session);

    await Profile.findOneAndDelete({ userId }).session(session);

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
  } finally {
    session.endSession();
  }

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
