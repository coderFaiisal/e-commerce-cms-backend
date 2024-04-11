import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { IGenericErrorResponse } from '../types/common';
import { IGenericErrorMessage } from '../types/error';

const handleCastError = (
  error: mongoose.Error.CastError,
): IGenericErrorResponse => {
  const errors: IGenericErrorMessage[] = [
    {
      path: error?.path,
      message: 'Invalid Id',
    },
  ];
  const statusCode = httpStatus.BAD_REQUEST;
  return {
    statusCode,
    message: 'Cast Error',
    errorMessages: errors,
  };
};

export default handleCastError;
