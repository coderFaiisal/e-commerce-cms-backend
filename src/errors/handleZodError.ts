import httpStatus from 'http-status';
import { ZodError, ZodIssue } from 'zod';
import { TGenericErrorResponse } from '../types/common';
import { TGenericErrorMessage } from '../types/error';

const handleZodError = (error: ZodError): TGenericErrorResponse => {
  const errors: TGenericErrorMessage[] = error?.issues?.map(
    (issue: ZodIssue) => {
      return {
        path: issue?.path[issue?.path?.length - 1],
        message: issue?.message,
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

export default handleZodError;
