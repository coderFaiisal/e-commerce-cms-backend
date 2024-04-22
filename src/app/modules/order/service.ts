import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';
import { USER_ROLE } from '../../../constant/user';
import ApiError from '../../../errors/ApiError';
import { asyncForEach } from '../../../shared/asyncForEach';
import { TGenericResponse } from '../../../types/common';
import QueryBuilder from '../../builder/QueryBuilder';
import { Product } from '../product/model';
import { Store } from '../store/model';
import { User } from '../user/model';
import { Order, OrderItem } from './model';
import { TOrder, TOrderItem, TOrdersResponse } from './type';
import { generateTrackingNumber } from './utils';

const createOrder = async (
  user: JwtPayload | null,
  payload: TOrder & { orderItems: TOrderItem[] },
): Promise<boolean> => {
  const isUserExist = await User.findOne({ email: user?.email }).lean();

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exist!");
  }

  if (!payload.isPaid) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Please, complete payment.');
  }

  const { orderItems, ...orderData } = payload;

  orderData.userId = isUserExist._id;

  orderData.trackingNumber = generateTrackingNumber();

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Update product quantity
    await asyncForEach(orderItems, async (item: TOrderItem) => {
      const product = await Product.findById(item.productId).session(session);

      if (
        product &&
        product.stockQuantity &&
        product.stockQuantity >= item.quantity
      ) {
        product.stockQuantity -= item.quantity;
      } else {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          `${product?.name} is stock out!`,
        );
      }

      if (product?.stockQuantity < 1) {
        product.isFeatured = false;
        product.isArchived = true;
        product.status = 'stock out';
      }

      await product.save({ session });
    });

    const order = await Order.create([orderData], { session });

    await asyncForEach(orderItems, async (orderItem: TOrderItem) => {
      orderItem.orderId = order[0]._id;

      await OrderItem.create([orderItem], { session });
    });

    const commitResult = await session.commitTransaction();

    if (commitResult && commitResult.ok === 1) {
      await session.endSession();

      return true;
    } else {
      throw new ApiError(httpStatus.NOT_MODIFIED, 'Transaction commit failed!');
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    throw error;
  }
};

const getAllOrders = async (
  user: JwtPayload | null,
  storeId: string,
  query: Record<string, unknown>,
): Promise<TGenericResponse<TOrdersResponse[]>> => {
  const isUserExist = await User.findOne({ email: user?.email }).lean();

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exist!");
  }

  if (user?.role === USER_ROLE.user) {
    const userOrders = new QueryBuilder(
      Order.find({ userId: isUserExist._id }),
      query,
    )
      .search(['orderStatus'])
      .filter()
      .sort()
      .paginate()
      .fields();

    const { page, limit, total } = await userOrders.countTotal();

    const orders = await userOrders.modelQuery;

    const result: TOrdersResponse[] = [];

    await asyncForEach(orders, async (order: TOrder & { _id: string }) => {
      const orderItems = await OrderItem.find({
        orderId: order._id,
      }).lean();

      result.push({
        order,
        orderItems,
      });
    });

    return {
      meta: {
        page,
        limit,
        total,
      },
      data: result,
    };
  }

  const isStoreExist = await Store.findById(storeId).lean();

  if (!isStoreExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Store doesn't exist!");
  }

  const userIdString = isUserExist?._id.toString();
  const storeUserIdString = isStoreExist?.userId.toString();

  if (userIdString !== storeUserIdString) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden access.');
  }

  const storeOwnerOrders = new QueryBuilder(Order.find({ storeId }), query)
    .search(['orderStatus'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const { page, limit, total } = await storeOwnerOrders.countTotal();

  const orders = await storeOwnerOrders.modelQuery;

  const result: TOrdersResponse[] = [];

  await asyncForEach(orders, async (order: TOrder & { _id: string }) => {
    const orderItems = await OrderItem.find({
      orderId: order._id,
    }).lean();

    result.push({
      order,
      orderItems,
    });
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleOrder = async (
  user: JwtPayload | null,
  orderId: string,
): Promise<{
  order: TOrder;
  orderItems: TOrderItem[];
}> => {
  const order = await Order.findById(orderId).lean();

  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order doesn't exist!");
  }

  if (user?.role === USER_ROLE.user) {
    const isUserExist = await User.findOne({ email: user?.email }).lean();

    if (!isUserExist) {
      throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exist!");
    }

    const userIdString = isUserExist._id.toString();
    const orderUserIdString = order.userId.toString();

    if (userIdString !== orderUserIdString) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden access.');
    }

    const orderItems = await OrderItem.find({ orderId });

    return {
      order,
      orderItems,
    };
  }

  const orderItems = await OrderItem.find({ orderId });

  return {
    order,
    orderItems,
  };
};

const updateOrder = async (
  user: JwtPayload | null,
  orderId: string,
  payload: Partial<TOrder>,
): Promise<boolean> => {
  const isOrderExist = await Order.findById(orderId).lean();

  if (!isOrderExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order doesn't exist!");
  }

  if (user?.role === USER_ROLE.user) {
    const isUserExist = await User.findOne({ email: user?.email }).lean();

    if (!isUserExist) {
      throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exist!");
    }

    const userIdString = isUserExist._id.toString();
    const orderUserIdString = isOrderExist.userId.toString();

    if (userIdString !== orderUserIdString) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden access.');
    }

    await Order.findByIdAndUpdate(orderId, payload);

    return true;
  }

  await Order.findByIdAndUpdate(orderId, payload);

  return true;
};

const cancelOrder = async (
  user: JwtPayload | null,
  orderId: string,
): Promise<boolean> => {
  const isUserExist = await User.findOne({ email: user?.email }).lean();

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exist!");
  }

  const isOrderExist = await Order.findById(orderId).lean();

  if (!isOrderExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order doesn't exist!");
  }

  const userIdString = isUserExist._id.toString();
  const orderUserIdString = isOrderExist.userId.toString();

  if (userIdString !== orderUserIdString) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden access.');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const orderItems = await OrderItem.find({ orderId }).session(session);

    await asyncForEach(orderItems, async (item: TOrderItem) => {
      const product = await Product.findById(item.productId).session(session);

      if (product) {
        product.stockQuantity += item.quantity;

        await product.save({ session });
      }
    });

    await Order.findByIdAndUpdate(orderId, { orderStatus: 'cancel' }).session(
      session,
    );

    await session.commitTransaction();
    session.endSession();

    return true;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    throw error;
  }
};

export const OrderService = {
  createOrder,
  getAllOrders,
  getSingleOrder,
  updateOrder,
  cancelOrder,
};
