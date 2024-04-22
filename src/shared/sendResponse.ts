import { Response } from 'express';

type TApiResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string | null;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
  data?: T | null;
};

const sendResponse = <T>(res: Response, data: TApiResponse<T>): void => {
  const responseData: TApiResponse<T> = {
    statusCode: data.statusCode,
    success: data.success,
    message: data.message || null,
    meta: data.meta || null || undefined,
    data: data.data || null,
  };
  res.status(data.statusCode).json(responseData);
};

export default sendResponse;
