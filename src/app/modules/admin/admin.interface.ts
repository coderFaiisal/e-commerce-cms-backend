import { Model } from 'mongoose';

/* eslint-disable no-unused-vars */
export type IAdmin = {
  name: string;
  email: string;
  password: string;
  role?: 'admin';
  image?: string;
};

export type AdminModel = {
  isAdminExist(email: string): Promise<IAdmin | null>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string,
  ): Promise<boolean>;
} & Model<IAdmin>;
