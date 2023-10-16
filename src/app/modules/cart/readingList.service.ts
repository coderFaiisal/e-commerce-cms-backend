import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import { IReadingList } from './readingList.interface';
import { ReadingList } from './readingList.model';

const createReadingList = async (
  payload: IReadingList,
): Promise<IReadingList> => {
  const { userEmail, bookId } = payload;

  const isExist = await ReadingList.findOne({ userEmail, bookId });

  if (isExist) {
    throw new ApiError(httpStatus.CONFLICT, 'Already added');
  }

  payload.status = 'read soon';

  const result = (await ReadingList.create(payload)).populate('bookId');
  return result;
};

const getReadingLists = async (
  user: JwtPayload | null,
): Promise<IReadingList[]> => {
  const result = await ReadingList.find({ userEmail: user?.email }).populate(
    'bookId',
  );
  return result;
};

const getSingleReadingLists = async (
  user: JwtPayload | null,
  bookId: string,
): Promise<IReadingList | null> => {
  //check list
  const isListExist = await ReadingList.findOne({
    userEmail: user?.email,
    bookId: bookId,
  });

  let result = null;

  if (isListExist) {
    result = isListExist;
  }

  return result;
};

const updateReadingList = async (
  user: JwtPayload | null,
  listId: string,
  payload: Partial<IReadingList>,
): Promise<IReadingList | null> => {
  //check list
  const isListExist = await ReadingList.findById(listId);

  if (!isListExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Reading item does not found!');
  }

  //check authentic user
  if (isListExist?.userEmail !== user?.email) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized');
  }

  const result = await ReadingList.findByIdAndUpdate(listId, payload, {
    new: true,
  }).populate('bookId');

  return result;
};

const deleteReadingList = async (
  user: JwtPayload | null,
  bookId: string,
): Promise<IReadingList | null> => {
  //check list
  const isListExist = await ReadingList.findOne({ bookId });

  if (!isListExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Reading item does not found!');
  }

  //check authentic user
  if (isListExist?.userEmail !== user?.email) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized');
  }

  const result = await ReadingList.findOneAndDelete({ bookId });

  return result;
};

export const ReadingListService = {
  createReadingList,
  getReadingLists,
  getSingleReadingLists,
  updateReadingList,
  deleteReadingList,
};
