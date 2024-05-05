/* eslint-disable @typescript-eslint/no-explicit-any */

import { TGenericErrorResponse } from '../types/common';
import { TGenericErrorMessage } from '../types/error';

const handleDuplicateError = (err: any): TGenericErrorResponse => {
  const match = err.message.match(/"([^"]*)"/);

  const extractedMessage = match && match[1];

  const errors: TGenericErrorMessage[] = [
    {
      path: '',
      message: `${extractedMessage} is already exists`,
    },
  ];

  const statusCode = 400;

  return {
    statusCode,
    message: 'Invalid ID',
    errorMessages: errors,
  };
};

export default handleDuplicateError;
