import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
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

  const result = await Material.create(materialData);

  return result;
};

const getAllMaterials = async (
  storeId: string,
): Promise<IMaterial[] | null> => {
  const result = await Material.find({ storeId }).populate('storeId').lean();

  return result;
};

const getSingleMaterial = async (
  materialId: string,
): Promise<IMaterial | null> => {
  const result = await Material.findById(materialId).populate('storeId').lean();

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
  })
    .populate('storeId')
    .lean();

  if (!result) {
    throw new ApiError(httpStatus.NOT_MODIFIED, 'Failed to update material');
  }

  return result;
};

const deleteMaterial = async (
  materialId: string,
): Promise<IMaterial | null> => {
  const isMaterialExist = await Material.findById(materialId).lean();

  if (!isMaterialExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Material does not exist');
  }

  const result = await Material.findByIdAndDelete(materialId);

  return result;
};

export const MaterialService = {
  createMaterial,
  getAllMaterials,
  getSingleMaterial,
  updateMaterial,
  deleteMaterial,
};
