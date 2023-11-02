import { Request, Response } from 'express';
import httpStatus from 'http-status';
import config from '../../../config';
import { IAdminSignUpResponse } from '../../../interfaces/common';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IUser } from '../user/user.interface';
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

const getAdminProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  const result = await AdminService.getAdminProfile(user);

  sendResponse<IUser>(res, {
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
  getAdminProfile,
  updateAdminProfile,
};
