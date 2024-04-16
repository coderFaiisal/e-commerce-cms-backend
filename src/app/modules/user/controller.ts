import { Request, Response } from 'express';
import httpStatus from 'http-status';
import config from '../../../config';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { UserService } from './service';
import { TAccessTokenResponse, TSignInResponse, TSignUpResponse } from './type';

const signIn = catchAsync(async (req: Request, res: Response) => {
  const { ...signInData } = req.body;
  const result = await UserService.signIn(signInData);

  const { refreshToken, ...others } = result;

  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse<Partial<TSignInResponse>>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Sign in Successfully.',
    data: others,
  });
});

const signUp = catchAsync(async (req: Request, res: Response) => {
  const { ...signUpData } = req.body;

  const result = await UserService.signUp(signUpData);

  const { refreshToken, ...others } = result;

  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse<Partial<TSignUpResponse>>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Account created Successfully.',
    data: others,
  });
});

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const { ...data } = req.body;

  await UserService.createAdmin(data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin created successfully.',
  });
});

const accessToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  const result = await UserService.accessToken(refreshToken);

  sendResponse<TAccessTokenResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Token created Successfully.',
    data: result,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  const { ...passwordData } = req.body;

  const result = await UserService.changePassword(user, passwordData);

  sendResponse<boolean>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password changed successfully.',
    data: result,
  });
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const userEmail = req.body.email;

  const result = await UserService.forgotPassword(userEmail);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Please, check your email.',
    data: result,
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.resetPassword();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: '',
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getAllUsers();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users retrieved successfully.',
    data: result,
  });
});

const getAllStoreOwners = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getAllStoreOwners();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Store owners retrieved successfully.',
    data: result,
  });
});

const getAllAdmins = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getAllAdmins();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admins retrieved successfully.',
    data: result,
  });
});

const getProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  const result = await UserService.getProfile(user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile retrieved successfully.',
    data: result,
  });
});

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await UserService.getSingleUser(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User retrieved successfully.',
    data: result,
  });
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  const { ...updatedData } = req.body;

  const result = await UserService.updateProfile(user, updatedData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile updated successfully.',
    data: result,
  });
});

const deleteAccount = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await UserService.deleteAccount(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Account deleted successfully.',
    data: result,
  });
});

export const UserController = {
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
