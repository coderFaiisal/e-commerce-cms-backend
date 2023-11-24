import httpStatus from 'http-status';
import { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { jwtHelper } from '../../../helpers/jwtHelper';
import {
  IChangePassword,
  IRefreshTokenResponse,
  ISignIn,
  ISignInResponse,
  IUserSignUpResponse,
} from '../../../interfaces/common';
import { IUser } from '../user/user.interface';
import { User } from '../user/user.model';

const signUpUser = async (user: IUser): Promise<IUserSignUpResponse> => {
  //set user role
  user.role = 'user';

  const isExist = await User.findOne({
    email: user.email,
  }).lean();

  if (isExist) {
    throw new ApiError(httpStatus.CONFLICT, 'User already exist');
  }

  const createdUser = await User.create(user);

  //create jwt token
  const { email, role } = createdUser;

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
    createdUser,
    accessToken,
    refreshToken,
  };
};

const signInUser = async (payload: ISignIn): Promise<ISignInResponse> => {
  const { email: userEmail, password } = payload;

  //check user
  const isUserExist = await User.isUserExist(userEmail);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  //check password
  const isPasswordMatched = await User.isPasswordMatched(
    password,
    isUserExist?.password as string,
  );

  if (!isPasswordMatched) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
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

const changePassword = async (
  user: JwtPayload | null,
  payload: IChangePassword,
): Promise<void> => {
  const { oldPassword, newPassword } = payload;

  //check user
  const isUserExist = await User.findOne({ email: user?.email }).select(
    '+password',
  );

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  //check old password
  if (
    isUserExist.password &&
    !(await User.isPasswordMatched(oldPassword, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Old password is incorrect');
  }

  //set new password
  isUserExist.password = newPassword;

  // updating using save()
  isUserExist.save();
};

const refreshToken = async (
  refreshToken: string,
): Promise<IRefreshTokenResponse> => {
  const verifiedUser = jwtHelper.verifyToken(
    refreshToken,
    config.jwt.refresh_secret as Secret,
  );

  const { email, role } = verifiedUser;

  const isUserExist = await User.isUserExist(email);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
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

export const AuthService = {
  signUpUser,
  signInUser,
  changePassword,
  refreshToken,
};
