import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { TGenericErrorResponse } from '../types/common';
import { TGenericErrorMessage } from '../types/error';

const handleValidationError = (
  error: mongoose.Error.ValidationError,
): TGenericErrorResponse => {
  const errors: TGenericErrorMessage[] = Object.values(error?.errors).map(
    (element: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: element?.path,
        message: element?.message,
      };
    },
  );
  const statusCode = httpStatus.BAD_REQUEST;
  return {
    statusCode,
    message: 'Validation Error',
    errorMessages: errors,
  };
};

export default handleValidationError;
