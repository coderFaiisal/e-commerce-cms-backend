import axios from 'axios';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import mongoose, { Types } from 'mongoose';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { Notification } from '../notification/model';
import { Payment } from '../payment/model';
import { Profile, User } from '../user/model';
import { Subscription } from './model';
import { TSubscription, plans } from './type';

const createSubscription = async (
  user: JwtPayload | null,
  payload: {
    plan: plans;
    startTime: Date;
    endTime: Date;
    isActive: boolean;
    isPaid: boolean;
    userId: Types.ObjectId;
    totalCost: number;
  },
): Promise<Record<string, unknown>> => {
  const isUserExist = await User.findOne({ email: user?.email }).lean();

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exist!");
  }
  const isProfileExist = await Profile.findOne({
    userId: isUserExist?._id,
  }).lean();

  if (!isProfileExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Profile doesn't exist!");
  }

  const isAlreadySubscribed = await Subscription.findOne({
    userId: isUserExist._id,
  }).lean();

  if (isAlreadySubscribed) {
    throw new ApiError(
      httpStatus.CONFLICT,
      'Already subscribed. Please renew it.',
    );
  }

  payload.userId = isUserExist._id;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const subscription = await Subscription.create([payload], { session });

    const today = new Date();

    const transactionId =
      'Subs' +
      '-' +
      today.getFullYear() +
      today.getMonth() +
      today.getDay() +
      today.getHours() +
      today.getMinutes();

    const paymentData = {
      amount: payload.totalCost,
      transactionId,
      paymentFor: 'subscription',
      paymentForId: subscription[0]._id,
      userId: isUserExist._id,
    };

    await Payment.create([paymentData], { session });

    const notificationData = {
      title: 'New Subscriber',
      message: `You received new subscriber - ${isProfileExist.name}`,
      notificationFor: 'subscription',
      userId: isUserExist._id,
    };

    await Notification.create([notificationData], { session });

    const initPaymentData = {
      amount: payload.totalCost,
      transactionId,
      name: isProfileExist.name,
      email: isUserExist.email,
      phoneNumber: isProfileExist.phoneNumber,
      productCategory: subscription[0].plan,
    };

    const commitResult = await session.commitTransaction();

    if (commitResult && commitResult.ok === 1) {
      await session.endSession();

      const initPayment = await axios.post(
        config.init_subscription_payment_api_end_point as string,
        initPaymentData,
      );

      return initPayment.data.data;
    } else {
      throw new ApiError(httpStatus.NOT_MODIFIED, 'Transaction commit failed!');
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    throw error;
  }
};

const getSingleSubscription = async (id: string): Promise<TSubscription> => {
  const result = await Subscription.findById(id).populate('userId').lean();

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Subscription doesn't found!");
  }

  return result;
};

const renewOrUpgradeSubscription = async (
  id: string,
  payload: Partial<TSubscription & { totalCost: number }>,
): Promise<boolean> => {
  const isSubscriptionExist = await Subscription.findById(id);

  if (!isSubscriptionExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Subscription doesn't found.");
  }

  const isUserExist = await User.findById(isSubscriptionExist.userId).lean();

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exist!");
  }
  const isProfileExist = await Profile.findOne({
    userId: isUserExist?._id,
  }).lean();

  if (!isProfileExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Profile doesn't exist!");
  }

  if (payload.plan) {
    isSubscriptionExist.plan = payload.plan;
  }

  if (payload.endTime) {
    isSubscriptionExist.endTime = payload.endTime;
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    await isSubscriptionExist.save({ session });

    const today = new Date();

    const transactionId =
      'Subs' +
      '-' +
      today.getFullYear() +
      today.getMonth() +
      today.getDay() +
      today.getHours() +
      today.getMinutes();

    const paymentData = {
      amount: payload.totalCost,
      transactionId,
      paymentFor: 'subscription',
      paymentForId: isSubscriptionExist._id,
      userId: isUserExist._id,
    };

    await Payment.create([paymentData], { session });

    const notificationData = {
      title: 'Renew Subscription',
      message: `${isProfileExist.name} is renew his subscription.`,
      notificationFor: 'subscription',
      userId: isUserExist._id,
    };

    await Notification.create([notificationData], { session });

    const initPaymentData = {
      amount: payload.totalCost,
      transactionId,
      name: isProfileExist.name,
      email: isUserExist.email,
      phoneNumber: isProfileExist.phoneNumber,
      productCategory: isSubscriptionExist.plan,
    };

    const commitResult = await session.commitTransaction();

    if (commitResult && commitResult.ok === 1) {
      await session.endSession();

      const initPayment = await axios.post(
        config.init_subscription_payment_api_end_point as string,
        initPaymentData,
      );

      return initPayment.data.data;
    } else {
      throw new ApiError(httpStatus.NOT_MODIFIED, 'Transaction commit failed!');
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    throw error;
  }
};

const cancelSubscription = async (id: string): Promise<boolean> => {
  const isSubscriptionExist = await Subscription.findById(id);

  if (!isSubscriptionExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Subscription doesn't found!");
  }

  isSubscriptionExist.isActive = false;

  const result = await isSubscriptionExist.save();

  if (!result) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Failed to cancel subscription.',
    );
  }

  return true;
};

export const SubscriptionService = {
  createSubscription,
  getSingleSubscription,
  renewOrUpgradeSubscription,
  cancelSubscription,
};
