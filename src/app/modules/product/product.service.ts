import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { SortOrder } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { productSearchableFields } from './product.constant';
import { IProduct, IProductFilter } from './product.interface';
import { Product } from './product.model';

const createProduct = async (payload: IProduct): Promise<IProduct> => {
  const { name } = payload;

  const isExist = await Product.findOne({ name });

  if (isExist) {
    throw new ApiError(httpStatus.CONFLICT, 'This Product already added');
  }

  const result = await Product.create(payload);
  return result;
};

const getSingleProduct = async (
  productId: string,
): Promise<IProduct | null> => {
  const result = await Product.findById(productId);
  return result;
};

const getAllProducts = async (
  filters: IProductFilter,
  paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<IProduct[]>> => {
  //search logic
  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: productSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  //filter logic
  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  //pagination logic
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  //conditional query
  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Product.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Product.countDocuments();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const updateProduct = async (
  productId: string,
  user: JwtPayload | null,
  payload: Partial<IProduct>,
): Promise<IProduct | null> => {
  const isProductExist = await Product.isProductExist(productId);
  if (!isProductExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product does not found!');
  }

  if (user?.role !== 'admin') {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
  }

  const result = await Product.findByIdAndUpdate(productId, payload, {
    new: true,
  });
  return result;
};

const deleteProduct = async (
  productId: string,
  user: JwtPayload | null,
): Promise<IProduct | null> => {
  const isProductExist = await Product.isProductExist(productId);
  if (!isProductExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product does not found!');
  }

  if (user?.role !== 'admin') {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
  }

  const result = await Product.findByIdAndDelete(productId);
  return result;
};

export const ProductService = {
  createProduct,
  getSingleProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
};
