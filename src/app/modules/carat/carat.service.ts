import httpStatus from 'http-status';
import mongoose from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { Store } from '../store/store.model';
import { ICarat } from './carat.interface';
import { Carat } from './carat.model';

const createCarat = async (caratData: ICarat): Promise<ICarat | null> => {
  const isCaratExist = await Carat.findOne({ name: caratData.name }).lean();

  if (isCaratExist) {
    throw new ApiError(httpStatus.CONFLICT, 'Carat already exist');
  }

  //start session
  let result = null;

  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    result = await Carat.create([caratData], { session });

    // Add billboardId into associated store
    const store = await Store.findByIdAndUpdate(
      caratData.storeId,
      {
        $push: { carats: result[0]?._id },
      },
      { session },
    );

    if (!store) {
      throw new ApiError(httpStatus.NOT_MODIFIED, 'Failed to update store');
    }

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    session.endSession();
  }

  return result[0];
};

const getAllCarats = async (): Promise<ICarat[] | null> => {
  const result = await Carat.find({});

  return result;
};

const getSingleCarat = async (caratId: string): Promise<ICarat | null> => {
  const result = await Carat.findById(caratId)
    .populate('storeId')
    .populate('products')
    .lean();

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Carat does not found');
  }

  return result;
};

const updateCarat = async (
  caratId: string,
  updatedData: Partial<ICarat>,
): Promise<ICarat | null> => {
  const result = await Carat.findByIdAndUpdate(caratId, updatedData, {
    new: true,
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_MODIFIED, 'Failed to update carat');
  }

  return result;
};

const deleteCarat = async (caratId: string): Promise<ICarat | null> => {
  let result = null;

  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    const isCaratExist = await Carat.findById(caratId).lean();

    if (!isCaratExist) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Carat does not found');
    }

    await Store.findByIdAndUpdate(
      isCaratExist.storeId,
      {
        $pull: { carats: caratId },
      },
      { session },
    );

    result = await Carat.findByIdAndDelete(caratId).session(session);

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    session.endSession();
  }

  return result;
};

export const CaratService = {
  createCarat,
  getAllCarats,
  getSingleCarat,
  updateCarat,
  deleteCarat,
};
