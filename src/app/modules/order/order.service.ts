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
    const userOrders = await Order.find({ userEmail: user.email });

    return userOrders;
  }

  const allOrders = await Order.find();

  return allOrders;
};

const getSingleOrder = async (
  id: string,
  user: JwtPayload | null,
): Promise<IOrder | null> => {
  let result;

  //check order
  const order = await Order.findById(id);

  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order does not found!');
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
  user: JwtPayload | null,
  orderId: string,
  payload: Partial<IOrder>,
): Promise<IOrder | null> => {
  //check list
  const isOrderExist = await Order.findById(orderId);

  if (!isOrderExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order does not found!');
  }

  //check authentic user
  if (isOrderExist?.userEmail !== user?.email) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized');
  }

  const result = await Order.findByIdAndUpdate(orderId, payload, {
    new: true,
  });

  return result;
};

const deleteOrder = async (
  user: JwtPayload | null,
  orderId: string,
): Promise<IOrder | null> => {
  //check list
  const isOrderExist = await Order.findOne({ orderId });

  if (!isOrderExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order does not found!');
  }

  //check authentic user
  if (isOrderExist?.userEmail !== user?.email) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized');
  }

  const result = await Order.findOneAndDelete({ orderId });

  return result;
};

export const OrderService = {
  createOrder,
  getAllOrders,
  getSingleOrder,
  updateOrder,
  deleteOrder,
};
