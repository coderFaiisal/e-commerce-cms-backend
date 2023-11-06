import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { IMaterial } from './material.interface';
import { Material } from './material.model';

const createMaterial = async (
  payload: IMaterial,
): Promise<IMaterial | null> => {
  const isMaterialExist = await Material.findOne({ name: payload.name }).lean();

  if (isMaterialExist) {
    throw new ApiError(httpStatus.CONFLICT, 'Material already exist!');
  }

  const result = await Material.create(payload);

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

  return result;
};

const updateMaterial = async (
  materialId: string,
  updatedData: Partial<IMaterial>,
): Promise<IMaterial | null> => {
  const result = await Material.findByIdAndUpdate(materialId, updatedData, {
    new: true,
  });

  return result;
};

const deleteMaterial = async (
  materialId: string,
): Promise<IMaterial | null> => {
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
