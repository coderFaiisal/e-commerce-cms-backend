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
  console.log(materialId);
  return null;
};

export const MaterialService = {
  createMaterial,
  getAllMaterials,
  getSingleMaterial,
  updateMaterial,
  deleteMaterial,
};
