import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { Product } from '../product/product.model';
import { IOrder } from './order.interface';
import { Order } from './order.model';
import { generateTrackingNumber } from './order.utils';

const createOrder = async (order: IOrder): Promise<IOrder> => {
  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    // Generate tracking number
    order.trackingNumber = generateTrackingNumber();

    // Update product quantity
    await Promise.all(
      order.orderItems.map(async orderItem => {
        const product = await Product.findById(orderItem.productId).session(
          session,
        );

        if (product && product.stockQuantity) {
          product.stockQuantity -= orderItem.quantity;

          await product.save({ session });
        }
      }),
    );

    const result = await Order.create([order], { session });

    await session.commitTransaction();

    return result[0];
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    session.endSession();
  }
};

const getAllOrders = async (
  storeId: string,
  user: JwtPayload | null,
): Promise<IOrder[]> => {
  if (user?.role === 'user') {
    const userOrders = await Order.find({
      userEmail: user.email,
    }).lean();

    return userOrders;
  }

  const allOrders = await Order.find({ storeId })
    .populate('orderItems.productId')
    .lean();

  return allOrders;
};

const getSingleOrder = async (
  orderId: string,
  user: JwtPayload | null,
): Promise<IOrder | null> => {
  //check order
  const order = await Order.findById(orderId).lean();

  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order does not found');
  }

  if (user?.role === 'user') {
    //check authentic buyer
    if (order.userEmail !== user.email) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized Access!');
    }

    return order;
  }

  return order;
};

const updateOrder = async (
  orderId: string,
  user: JwtPayload | null,
  updatedData: Partial<IOrder>,
): Promise<IOrder | null> => {
  //check list
  const isOrderExist = await Order.findById(orderId).lean();

  if (!isOrderExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order does not exist');
  }

  if (user?.role === 'user') {
    //check authentic user
    if (isOrderExist?.userEmail !== user?.email) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized');
    }

    const result = await Order.findByIdAndUpdate(orderId, updatedData, {
      new: true,
    });

    if (!result) {
      throw new ApiError(httpStatus.NOT_MODIFIED, 'Failed to update order');
    }

    return result;
  }

  if (user?.role === 'admin') {
    const result = await Order.findByIdAndUpdate(orderId, updatedData, {
      new: true,
    });

    if (!result) {
      throw new ApiError(httpStatus.NOT_MODIFIED, 'Failed to update order');
    }

    return result;
  }

  return null;
};

const deleteOrder = async (
  orderId: string,
  user: JwtPayload | null,
): Promise<IOrder | null> => {
  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    const order = await Order.findById(orderId).session(session);

    if (!order) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
    }

    await Promise.all(
      order.orderItems.map(async orderItem => {
        const product = await Product.findById(orderItem.productId).session(
          session,
        );

        if (product) {
          product.stockQuantity += orderItem.quantity;

          await product.save({ session });
        }
      }),
    );

    if (user?.role === 'user') {
      //check authentic user
      if (order?.userEmail !== user?.email) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized');
      }

      const result = await Order.findByIdAndDelete(orderId).session(session);

      return result;
    }

    if (user?.role === 'admin') {
      const result = await Order.findByIdAndDelete(orderId).session(session);

      return result;
    }

    await session.commitTransaction();

    return null;
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    session.endSession();
  }
};

export const OrderService = {
  createOrder,
  getAllOrders,
  getSingleOrder,
  updateOrder,
  deleteOrder,
};
