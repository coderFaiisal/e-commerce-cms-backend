import httpStatus from 'http-status';
import mongoose from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { Store } from '../store/store.model';
import { IMaterial } from './material.interface';
import { Material } from './material.model';

const createMaterial = async (
  materialData: IMaterial,
): Promise<IMaterial | null> => {
  const isMaterialExist = await Material.findOne({
    name: materialData.name,
  }).lean();

  if (isMaterialExist) {
    throw new ApiError(httpStatus.CONFLICT, 'Material already exist');
  }

  //start session
  let result = null;

  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    result = await Material.create([materialData], { session });

    // Add billboardId into associated store
    const store = await Store.findByIdAndUpdate(
      materialData.storeId,
      {
        $push: { materialss: result[0]?._id },
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

const getAllMaterials = async (): Promise<IMaterial[] | null> => {
  const result = await Material.find({});

  return result;
};

const getSingleMaterial = async (
  materialId: string,
): Promise<IMaterial | null> => {
  const result = await Material.findById(materialId);

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Material does not found');
  }

  return result;
};

const updateMaterial = async (
  materialId: string,
  updatedData: Partial<IMaterial>,
): Promise<IMaterial | null> => {
  const result = await Material.findByIdAndUpdate(materialId, updatedData, {
    new: true,
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_MODIFIED, 'Failed to update material');
  }

  return result;
};

const deleteMaterial = async (
  materialId: string,
): Promise<IMaterial | null> => {
  let result = null;

  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    const isMaterialExist = await Material.findById(materialId).lean();

    if (!isMaterialExist) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Material does not found');
    }

    await Store.findByIdAndUpdate(
      isMaterialExist.storeId,
      {
        $pull: { materials: materialId },
      },
      { session },
    );

    result = await Material.findByIdAndDelete(materialId).session(session);

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    session.endSession();
  }

  return result;
};

export const MaterialService = {
  createMaterial,
  getAllMaterials,
  getSingleMaterial,
  updateMaterial,
  deleteMaterial,
};
