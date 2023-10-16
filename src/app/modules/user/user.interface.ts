/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export type IUser = {
  name: string;
  email: string;
  password: string;
  role: string;
};

export type UserModel = {
  isUserExist(email: string): Promise<IUser | null>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string,
  ): Promise<boolean>;
} & Model<IUser>;

export type ILoginUser = {
  email: string;
  password: string;
};

export type ILoginResponse = {
  accessToken: string;
  refreshToken?: string;
};

export type IRefreshTokenResponse = {
  accessToken: string;
};
