import httpStatus from 'http-status';
import mongoose from 'mongoose';
import ApiError from '../../../errors/ApiError';
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

    const store = await Store.findByIdAndUpdate(
      billboardData.storeId,
      {
        $push: { billboards: result[0]?._id },
      },
      { session },
    );

    if (!store) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Store does not found!');
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
    throw new ApiError(httpStatus.NOT_FOUND, 'Billboard does not found!');
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
    throw new ApiError(httpStatus.NOT_FOUND, 'Billboard does not found!');
  }

  return result;
};

const deleteBillboard = async (
  billboardId: string,
): Promise<IBillboard | null> => {
  //store collection থেকে billboard, categories, products delete হবে।
  // category collection থেকে categoriesId delete হবে।
  // product collection থেকে products delete হবে।
  // carat থেকে products delete হবে।
  // material থেকে products delete হবে।
  // billboard collection থেকে billboard delete হবে।

  // billboardId
  // storeId
  // categoriesId = []
  // productsId = []

  const result = Billboard.aggregate([
    {
      $match: { _id: billboardId },
    },
    {
      $lookup: {
        from: 'categories',
        localField: 'categories',
        foreignField: '_id',
        as: 'categories',
      },
    },
    {
      $unwind: '$categories',
    },
    {
      $project: {
        productIds: '$categories.products',
      },
    },
    {
      $unwind: '$productIds',
    },
    {
      $group: {
        _id: null,
        productIds: { $addToSet: '$productIds' },
      },
    },
  ]);

  console.log(result);

  return null;
};

export const BillboardService = {
  createBillboard,
  getSingleBillboard,
  updateBillboard,
  deleteBillboard,
};

/* 
  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    const billboard = await Billboard.findById(billboardId).lean();

    if (!billboard) {
      throw new ApiError(httpStatus.NOT_FOUND, "Billboard doesn't found");
    }
 

    // Step 2: Delete associated categories and products
    // await Promise.all([
    //   Category.deleteMany({ _id: { $in: categoryIds } }).session(session),
    //   Product.deleteMany({ _id: { $in: productIds } }).session(session),
    //   Carat.deleteMany({ products: { $in: productIds } }).session(session),
    //   Material.deleteMany({ products: { $in: productIds } }).session(session),
    // ]);

    // Step 3: Remove billboard reference from store
  //   const storeId = billboard.storeId;
  //   await Store.findByIdAndUpdate(
  //     storeId,
  //     { $pull: { billboards: billboardId } },
  //     { new: true, session },
  //   );

  //   await session.commitTransaction();
  //   session.endSession();

  //   return billboard;
  // } catch (error) {
  //   await session.abortTransaction();
  //   session.endSession();
  //   throw error;
  // **/
