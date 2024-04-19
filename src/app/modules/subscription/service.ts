import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import { User } from '../user/model';
import { Subscription } from './model';
import { TSubscription } from './type';

const createSubscription = async (
  user: JwtPayload | null,
  payload: TSubscription,
) => {
  const isUserExist = await User.findOne(
    { email: user?.email },
    { email: 1, role: 1 },
  ).lean();

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't found!");
  }

  const isAlreadySubscribed = await Subscription.findOne({
    userId: isUserExist._id,
  }).lean();

  if (isAlreadySubscribed) {
    throw new ApiError(httpStatus.CONFLICT, 'Already subscribed.');
  }

  payload.userId = isUserExist._id;

  const result = (await Subscription.create(payload)).populate('userId');

  return result;
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
  payload: Partial<TSubscription>,
) => {
  const subscription = await Subscription.findById(id);

  if (!subscription) {
    throw new ApiError(httpStatus.NOT_FOUND, "Subscription doesn't found.");
  }

  if (payload.plan) {
    subscription.plan = payload.plan;
  }

  if (payload.endTime) {
    subscription.endTime = payload.endTime;
  }

  await subscription.save();

  return subscription;
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
