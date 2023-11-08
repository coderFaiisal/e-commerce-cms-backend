import httpStatus from 'http-status';
import mongoose from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { Carat } from '../carat/carat.model';
import { Category } from '../category/category.model';
import { Material } from '../material/material.model';
import { Product } from '../product/product.model';
import { Store } from '../store/store.model';
import { IBillboard } from './billboard.interface';
import { Billboard } from './billboard.model';

const createBillboard = async (
  billboardData: IBillboard,
): Promise<IBillboard | null> => {
  const result = null;

  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    const result = await Billboard.create([billboardData], { session });

    // Add billboardId into associated store
    const store = await Store.findByIdAndUpdate(
      billboardData.storeId,
      {
        $push: { billboards: result[0]?._id },
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

  return result;
};

const getSingleBillboard = async (
  billboardId: string,
): Promise<IBillboard | null> => {
  const result = await Billboard.findById(billboardId).populate('storeId');

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Billboard does not found');
  }

  return result;
};

const updateBillboard = async (
  billboardId: string,
  updatedData: Partial<IBillboard>,
): Promise<IBillboard | null> => {
  const result = await Billboard.findByIdAndUpdate(billboardId, updatedData, {
    new: true,
  }).populate('storeId');

  if (!result) {
    throw new ApiError(httpStatus.NOT_MODIFIED, 'Failed to update billboard');
  }

  return result;
};

const deleteBillboard = async (
  billboardId: string,
): Promise<IBillboard | null> => {
  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    const billboard = await Billboard.findById(billboardId).lean();

    if (!billboard) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Billboard does not found');
    }

    const storeId = billboard.storeId;
    const categoryIds = billboard.categories || [];

    // Delete the billboard from the associated store
    await Store.findByIdAndUpdate(
      storeId,
      { $pull: { billboards: billboardId } },
      { session },
    );

    // Delete categories associated with the billboard
    await Category.deleteMany({ _id: { $in: categoryIds } }).session(session);

    // Find productIds associated with the categories
    const productsData = await Category.aggregate([
      {
        $match: { _id: { $in: categoryIds } },
      },
      {
        $unwind: '$products',
      },
      {
        $group: {
          _id: null,
          productsId: { $addToSet: '$products' },
        },
      },
    ]).session(session);

    const productIds = productsData[0]?.productsId || [];

    // Delete products associated with the categories
    await Product.deleteMany({ _id: { $in: productIds } }).session(session);

    // Remove product references from carat collection
    await Carat.updateMany(
      { products: { $in: productIds } },
      { $pullAll: { products: productIds } },
    ).session(session);

    // Remove product references from material collection
    await Material.updateMany(
      { products: { $in: productIds } },
      { $pullAll: { products: productIds } },
    ).session(session);

    await Billboard.findByIdAndDelete(billboardId).session(session);

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    session.endSession();
  }

  return null;
};

export const BillboardService = {
  createBillboard,
  getSingleBillboard,
  updateBillboard,
  deleteBillboard,
};

// billboardId
// storeId
// categoriesId = []
// productsId = [] with aggregate

// billboard, categories, products wiil be delete from store collection.
// categories will be delete from category collection
// products will be delete from product collection
// products will be delete from carat collection.
// products will be delete from material collection.
// billboard will be delete from billboard collection
