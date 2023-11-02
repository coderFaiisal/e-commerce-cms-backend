import { Request, Response } from 'express';
import httpStatus from 'http-status';
import config from '../../../config';
import {
  IRefreshTokenResponse,
  ISignInResponse,
} from '../../../interfaces/common';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AuthService } from './auth.service';

const signUpUser = catchAsync(async (req: Request, res: Response) => {
  const { ...userData } = req.body;
  const result = await AuthService.signUpUser(userData);

  const { refreshToken, ...others } = result;

  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User created Successfully',
    data: others,
  });
});

const signInUser = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;
  const result = await AuthService.signInUser(loginData);

  const { refreshToken, ...others } = result;

  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse<Partial<ISignInResponse>>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Logged in Successfully',
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

  const result = await AuthService.refreshToken(refreshToken);

  sendResponse<IRefreshTokenResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access token created Successfully',
    data: result,
  });
});

export const AuthController = {
  signUpUser,
  signInUser,
  refreshToken,
};
