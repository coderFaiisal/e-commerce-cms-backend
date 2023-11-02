import { Request, Response } from 'express';
import httpStatus from 'http-status';
import config from '../../../config';
import {
  IAdminSignUpResponse,
  IRefreshTokenResponse,
  ISignInResponse,
} from '../../../interfaces/common';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { paginationFields } from '../../constant/pagination';
import { IUser } from '../user/user.interface';
import { IAdmin } from './admin.interface';
import { AdminService } from './admin.service';

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const { ...adminData } = req.body;
  const result = await AdminService.createAdmin(adminData);

  const { refreshToken, ...others } = result;

  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };
  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse<Partial<IAdminSignUpResponse>>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin created successfully',
    data: others,
  });
});

const signInAdmin = catchAsync(async (req: Request, res: Response) => {
  const { ...signInData } = req.body;

  const result = await AdminService.signInAdmin(signInData);

  const { refreshToken, ...others } = result;

  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };
  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse<Partial<ISignInResponse>>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Sign in successfully',
    data: others,
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  const result = await AdminService.refreshToken(refreshToken);

  sendResponse<IRefreshTokenResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access token created Successfully',
    data: result,
  });
});

const getAllAdmins = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, paginationFields);

  const result = await AdminService.getAllAdmins(paginationOptions);

  sendResponse<IAdmin[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admins data retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getAdminProfile = catchAsync(async (req: Request, res: Response) => {
  const admin = req.user;

  const result = await AdminService.getAdminProfile(admin);

  sendResponse<IAdmin>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin's information retrieved successfully",
    data: result,
  });
});

const updateAdminProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const { ...updatedData } = req.body;
  const result = await AdminService.updateAdminProfile(user, updatedData);

  sendResponse<Partial<IUser>>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin's information retrieved successfully",
    data: result,
  });
});

export const AdminController = {
  createAdmin,
  signInAdmin,
  refreshToken,
  getAllAdmins,
  getAdminProfile,
  updateAdminProfile,
};
