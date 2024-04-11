/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';

enum roles {
  User = 'user',
  Store_Owner = 'store-owner',
  Admin = 'admin',
  Super_Admin = 'super-admin',
}

export type TSignIn = {
  email: string;
  password: string;
};

export type TSignInResponse = {
  accessToken: string;
  refreshToken?: string;
};

export type TSignUp = {
  name: string;
  email: string;
  password: string;
  role?: string;
  image?: string;
  phoneNumber?: string;
  gender?: string;
  dob?: string;
};

export type TSignUpResponse = {
  accessToken: string;
  refreshToken?: string;
};

export type TAccessTokenResponse = {
  accessToken: string;
};

export type TChangePassword = {
  oldPassword: string;
  newPassword: string;
};

export type TUser = {
  email: string;
  password: string;
  role?: roles;
};

export type TProfile = {
  name: string;
  image?: string;
  phoneNumber?: string;
  gender?: 'male' | 'female' | 'others';
  dob?: string;
  userId: Types.ObjectId | TUser;
};

export type UserModel = {
  isUserExist(email: string): Promise<TUser | null>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string,
  ): Promise<boolean>;
} & Model<TUser>;
