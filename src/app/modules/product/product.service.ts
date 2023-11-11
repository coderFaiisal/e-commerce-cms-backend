import httpStatus from 'http-status';
import { SortOrder } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { Category } from './../category/category.model';
import { productSearchableFields } from './product.constant';
import { IProduct, IProductFilter } from './product.interface';
import { Product } from './product.model';
import { generateProductCode } from './product.utils';

const createProduct = async (productData: IProduct): Promise<IProduct> => {
  const { name } = productData;

  const isProductExist = await Product.findOne({ name }).lean();

  if (isProductExist) {
    throw new ApiError(httpStatus.CONFLICT, 'Product already exist');
  }

  const productCategory = await Category.findById(productData.categoryId);

  if (!productCategory) {
    throw new ApiError(httpStatus.CONFLICT, 'Product category does not found');
  }

  //generate product code
  productData.productCode = await generateProductCode(
    productCategory?.code as string,
  );

  const result = await Product.create(productData);

  return result;
};

const getAllProducts = async (
  filters: IProductFilter,
  paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<IProduct[]>> => {
  const andConditions = [];

  //search logic
  const { searchTerm, ...filtersData } = filters;

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

const getSingleProduct = async (
  productId: string,
): Promise<IProduct | null> => {
  const result = await Product.findById(productId)
    .populate('storeId')
    .populate('categoryId')
    .populate('materialId')
    .populate('caratId')
    .lean();

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product does not found');
  }

  return result;
};

const updateProduct = async (
  productId: string,
  updatedData: Partial<IProduct>,
): Promise<IProduct | null> => {
  const isProductExist = await Product.isProductExist(productId);

  if (!isProductExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product does not exist');
  }

  const result = await Product.findByIdAndUpdate(productId, updatedData, {
    new: true,
  })
    .populate('storeId')
    .populate('categoryId')
    .populate('materialId')
    .populate('caratId');

  if (!result) {
    throw new ApiError(httpStatus.NOT_MODIFIED, 'Failed to update product');
  }

  return result;
};

const deleteProduct = async (productId: string): Promise<IProduct | null> => {
  const isProductExist = await Product.isProductExist(productId);

  if (!isProductExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product does not exist');
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
