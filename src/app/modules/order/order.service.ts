import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import { IOrder } from './order.interface';
import { Order } from './order.model';

const createOrder = async (order: IOrder): Promise<IOrder> => {
  const result = await Order.create(order);
  return result;
};

const getAllOrders = async (user: JwtPayload | null): Promise<IOrder[]> => {
  if (user?.role === 'user') {
    const userOrders = await Order.find({ userEmail: user.email }).lean();

    return userOrders;
  }

  const allOrders = await Order.find().lean();

  return allOrders;
};

const getSingleOrder = async (
  orderId: string,
  user: JwtPayload | null,
): Promise<IOrder | null> => {
  let result;

  //check order
  const order = await Order.findById(orderId).lean();

  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order does not found');
  }

  if (user?.role === 'user') {
    //check authentic buyer
    if (order.userEmail !== user.email) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden Access!');
    }

    result = order;

    return result;
  }

  if (user?.role === 'admin') {
    result = order;

    return result;
  }

  return null;
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

    return result;
  }

  if (user?.role === 'admin') {
    const result = await Order.findByIdAndUpdate(orderId, updatedData, {
      new: true,
    });

    return result;
  }

  return null;
};

const deleteOrder = async (
  orderId: string,
  user: JwtPayload | null,
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

    const result = await Order.findByIdAndDelete(orderId);

    return result;
  }

  if (user?.role === 'admin') {
    const result = await Order.findByIdAndDelete(orderId);

    return result;
  }

  return null;
};

export const OrderService = {
  createOrder,
  getAllOrders,
  getSingleOrder,
  updateOrder,
  deleteOrder,
};
