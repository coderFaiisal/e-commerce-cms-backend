import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../config';
import ApiError from '../../errors/ApiError';
import { jwtHelper } from '../../helpers/jwtHelper';

const auth =
  (...requiredRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
      }

      const varifiedUser = jwtHelper.verifyToken(
        token,
        config.jwt.secret as Secret,
      );

      req.user = varifiedUser;

      if (requiredRoles.length && !requiredRoles.includes(varifiedUser.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden Access');
      }

      next();
    } catch (error) {
      next(error);
    }
  };

export default auth;
