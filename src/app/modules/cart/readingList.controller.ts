import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IReadingList } from './readingList.interface';
import { ReadingListService } from './readingList.service';

const createReadingList = catchAsync(async (req: Request, res: Response) => {
  const { ...readingListData } = req.body;

  const result = await ReadingListService.createReadingList(readingListData);

  sendResponse<IReadingList>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book successfully added into reading list',
    data: result,
  });
});

const getReadingLists = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  const result = await ReadingListService.getReadingLists(user);

  sendResponse<IReadingList[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Reading lists retrieved successfully',
    data: result,
  });
});

const getSingleReadingLists = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user;
    const bookId = req.params.id;

    const result = await ReadingListService.getSingleReadingLists(user, bookId);

    sendResponse<IReadingList>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Reading list retrieved successfully',
      data: result,
    });
  },
);

const updateReadingList = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const listId = req.params.id;
  const { ...updatedData } = req.body;

  const result = await ReadingListService.updateReadingList(
    user,
    listId,
    updatedData,
  );

  sendResponse<IReadingList>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Reading list status updated successfully',
    data: result,
  });
});

const deleteReadingList = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const bookId = req.params.id;

  const result = await ReadingListService.deleteReadingList(user, bookId);

  sendResponse<IReadingList>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Reading list delete successfully',
    data: result,
  });
});

export const ReadingListController = {
  createReadingList,
  getReadingLists,
  getSingleReadingLists,
  updateReadingList,
  deleteReadingList,
};
