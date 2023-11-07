import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { ICarat } from './carat.interface';
import { Carat } from './carat.model';

const createCarat = async (caratData: ICarat): Promise<ICarat | null> => {
  const isCaratExist = await Carat.findOne({ name: caratData.name }).lean();

  if (isCaratExist) {
    throw new ApiError(httpStatus.CONFLICT, 'Carat already exist!');
  }

  const result = await Carat.create(caratData);

  return result;
};

const getAllCarats = async (): Promise<ICarat[] | null> => {
  const result = await Carat.find({});

  return result;
};

const getSingleCarat = async (caratId: string): Promise<ICarat | null> => {
  const result = await Carat.findById(caratId);

  return result;
};

const updateCarat = async (
  caratId: string,
  updatedData: Partial<ICarat>,
): Promise<ICarat | null> => {
  const result = await Carat.findByIdAndUpdate(caratId, updatedData, {
    new: true,
  });

  return result;
};

const deleteCarat = async (caratId: string): Promise<ICarat | null> => {
  const result = await Carat.findByIdAndDelete(caratId);

  return result;
};

export const CaratService = {
  createCarat,
  getAllCarats,
  getSingleCarat,
  updateCarat,
  deleteCarat,
};
