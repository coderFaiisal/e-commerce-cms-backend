import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AnalyticsService } from './service';

const fetchDashboardAnalyticsData = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user;

    const result = await AnalyticsService.fetchDashboardAnalyticsData(user);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Analytics data fetched successfully.',
      data: result,
    });
  },
);

export const AnalyticsController = {
  fetchDashboardAnalyticsData,
};
