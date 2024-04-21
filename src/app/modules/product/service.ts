import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { asyncForEach } from '../../../shared/asyncForEach';
import { TGenericResponse } from '../../../types/common';
import QueryBuilder from '../../builder/QueryBuilder';
import { Attribute } from '../attribute/model';
import { Category } from '../category/model';
import { ProductReview } from '../productReview/model';
import { Store } from '../store/model';
import { User } from '../user/model';
import { productSearchableFields } from './constant';
import { Product, ProductImage } from './model';
import { TProduct } from './type';
import { generateProductCode } from './utils';

const createProduct = async (
  user: JwtPayload | null,
  payload: Partial<TProduct> & { productImages: string[] },
): Promise<boolean> => {
  const isProductExist = await Product.findOne({
    name: payload.name,
    storeId: payload.storeId,
  }).lean();

  if (isProductExist) {
    throw new ApiError(httpStatus.CONFLICT, 'Product already exist!');
  }

  const isUserExist = await User.findOne({ email: user?.email }).lean();

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exist!");
  }

  const isStoreExist = await Store.findById(payload.storeId).lean();

  if (!isStoreExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Store doesn't exist!");
  }

  const userIdString = isUserExist._id.toString();
  const storeUserIdString = isStoreExist.userId.toString();

  if (userIdString !== storeUserIdString) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden access.');
  }

  const isCategoryExist = await Category.findById(payload.categoryId).lean();

  if (!isCategoryExist) {
    throw new ApiError(httpStatus.CONFLICT, "Category doesn't exist!");
  }

  if (payload.attributeIds && payload.attributeIds.length > 0) {
    await asyncForEach(payload.attributeIds, async (attributeId: string) => {
      const isAttributeExist = await Attribute.findById(attributeId).lean();

      if (!isAttributeExist) {
        throw new ApiError(
          httpStatus.NOT_FOUND,
          `This ${attributeId} attribute id is invalid.`,
        );
      }
    });
  }

  //generate product code
  payload.productCode = await generateProductCode(isCategoryExist);

  const { productImages, ...productData } = payload;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const product = await Product.create([productData], { session });

    await asyncForEach(productImages, async (productImage: { url: string }) => {
      await ProductImage.create(
        [
          {
            url: productImage.url,
            productId: product[0]._id,
          },
        ],
        { session },
      );
    });

    await session.commitTransaction();
    session.endSession();

    return true;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    throw error;
  }
};

const getAllProducts = async (
  storeId: string,
  query: Record<string, unknown>,
): Promise<TGenericResponse<TProduct[]>> => {
  const productQuery = new QueryBuilder(Product.find({ storeId }), query)
    .search(productSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await productQuery.modelQuery;

  const { page, limit, total } = await productQuery.countTotal();

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
): Promise<TProduct | null> => {
  const result = await Product.findById(productId)
    .populate('storeId')
    .populate('categoryId')
    .populate('attributeIds')
    .lean();

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product doesn't found.");
  }

  return result;
};

const updateProduct = async (
  user: JwtPayload | null,
  productId: string,
  payload: Partial<TProduct>,
): Promise<boolean> => {
  const isProductExist = await Product.findById(productId)
    .populate('storeId')
    .lean();

  if (!isProductExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product doesn't exist!");
  }

  const isUserExist = await User.findOne({ email: user?.email }).lean();

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exist!");
  }

  const userIdString = isUserExist._id.toString();
  const storeUserIdString = isProductExist.storeId.userId.toString();

  if (userIdString !== storeUserIdString) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden access.');
  }

  if (payload?.stockQuantity) {
    payload.stockQuantity += isProductExist?.stockQuantity;
  }

  if ((payload.stockQuantity as number) > 0) {
    payload.status = 'stock';
  }

  await Product.findByIdAndUpdate(productId, payload);

  return true;
};

const deleteProduct = async (
  user: JwtPayload | null,
  productId: string,
): Promise<boolean> => {
  const isProductExist = await Product.findById(productId)
    .populate('storeId')
    .lean();

  if (!isProductExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product doesn't exist!");
  }

  const isUserExist = await User.findOne({ email: user?.email }).lean();

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exist!");
  }

  const userIdString = isUserExist._id.toString();
  const storeUserIdString = isProductExist.storeId.userId.toString();

  if (userIdString !== storeUserIdString) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden access.');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    await ProductImage.deleteMany({ productId }).session(session);

    await ProductReview.deleteMany({ productId }).session(session);

    await Product.findByIdAndDelete(productId).session(session);

    await session.commitTransaction();
    session.endSession();

    return true;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    throw error;
  }
};

export const ProductService = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
