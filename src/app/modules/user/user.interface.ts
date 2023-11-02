/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';

export type IUser = {
  name: string;
  email: string;
  password: string;
  role?: 'user';
  phoneNumber?: string;
  image?: string;
  reviews?: {
    productId?: Types.ObjectId;
    review?: string;
  }[];
};

export type UserModel = {
  isUserExist(email: string): Promise<IUser | null>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string,
  ): Promise<boolean>;
} & Model<IUser>;
