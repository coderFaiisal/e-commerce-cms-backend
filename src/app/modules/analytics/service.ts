import { JwtPayload } from 'jsonwebtoken';
import { USER_ROLE } from '../../../constant/user';
import { asyncForEach } from '../../../shared/asyncForEach';
import { Attribute } from '../attribute/model';
import { Billboard } from '../billboard/model';
import { Category } from '../category/model';
import { Order, OrderItem } from '../order/model';
import { Payment } from '../payment/model';
import { Product } from '../product/model';
import { Store } from '../store/model';
import { User } from '../user/model';
import { Subscription } from './../subscription/model';
import { generateLast12MonthsData } from './utils';

const fetchDashboardAnalyticsData = async (authUser: JwtPayload | null) => {
  const { user, store_owner, admin, super_admin } = USER_ROLE;

  let analyticsData;

  switch (authUser?.role) {
    case super_admin:
      analyticsData = getSuperAdminAnalyticsData();
      break;
    case admin:
      analyticsData = getAdminAnalyticsData();
      break;
    case store_owner:
      analyticsData = getStoreOwnerAnalyticsData(authUser);
      break;
    case user:
      analyticsData = getUserAnalyticsData(authUser);
      break;
    default:
      throw new Error('Invalid user role.');
  }

  return analyticsData;
};

const getSuperAdminAnalyticsData = async () => {
  const userCount = await User.count({ role: USER_ROLE.user });
  const subscriberCount = await User.count({ role: USER_ROLE.store_owner });
  const adminCount = await User.count({ role: USER_ROLE.admin });

  const totalSubscriptionCount = await Subscription.count();
  const activeSubscriptionCount = await Subscription.count({ isActive: true });
  const cancelSubscriptionCount = await Subscription.count({ isActive: false });

  const transactionCount = await Payment.count({
    status: 'paid',
    paymentFor: 'subscription',
  });

  let totalRevenue = 0;

  const result = await Payment.aggregate([
    {
      $match: {
        status: 'paid',
        paymentFor: 'subscription',
      },
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: '$amount' },
      },
    },
  ]);

  if (result.length > 0) {
    totalRevenue = result[0].totalAmount;
  }

  // const barChartData = await getBarChartData();
  // const pieCharData = await getPieChartData();

  return {
    userCount,
    subscriberCount,
    totalSubscriptionCount,
    transactionCount,
    activeSubscriptionCount,
    cancelSubscriptionCount,
    adminCount,
    totalRevenue,
    // barChartData,
    // pieCharData,
  };
};

const getAdminAnalyticsData = async () => {
  const userCount = await User.count({ role: USER_ROLE.user });
  const subscriberCount = await User.count({ role: USER_ROLE.store_owner });

  const totalSubscriptionCount = await Subscription.count();
  const activeSubscriptionCount = await Subscription.count({ isActive: true });
  const cancelSubscriptionCount = await Subscription.count({ isActive: false });

  const transactionCount = await Payment.count({
    status: 'paid',
    paymentFor: 'subscription',
  });

  let totalRevenue = 0;

  const result = await Payment.aggregate([
    {
      $match: {
        status: 'paid',
        paymentFor: 'subscription',
      },
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: '$amount' },
      },
    },
  ]);

  if (result.length > 0) {
    totalRevenue = result[0].totalAmount;
  }

  // const barChartData = await getBarChartData();
  // const pieCharData = await getPieChartData();

  return {
    userCount,
    subscriberCount,
    totalSubscriptionCount,
    transactionCount,
    activeSubscriptionCount,
    cancelSubscriptionCount,

    totalRevenue,
    // barChartData,
    // pieCharData,
  };
};

const getStoreOwnerAnalyticsData = async (authUser: JwtPayload | null) => {
  const storeOwner = await User.findOne({ email: authUser?.email }).lean();

  const result = {
    totalStore: 0,
    totalBillboard: 0,
    totalCategory: 0,
    totalAttribute: 0,
    totalProduct: 0,
    totalOrder: 0,
    totalRevenue: 0,
    last12MonthsOrder: [
      {
        month: '',
        count: 0,
      },
    ],
  };

  const stores = await Store.find({ userId: storeOwner?._id }, { _id: 1 });

  result.totalStore = stores.length;

  await asyncForEach(stores, async (store: { _id: string }) => {
    const storeId = store._id;

    result.totalBillboard += await Billboard.count({ storeId });
    result.totalCategory += await Category.count({ storeId });
    result.totalAttribute += await Attribute.count({ storeId });
    result.totalProduct += await Product.count({ storeId });
    result.totalOrder += await Order.count({ storeId, status: 'paid' });

    const orders = await Order.find({ storeId }, { _id: 1 });

    await asyncForEach(orders, async (order: { _id: string }) => {
      const orderId = order._id;

      const orderPayment = await Payment.findOne(
        { status: 'paid', paymentForId: orderId },
        { amount: 1, _id: 0 },
      );

      if (orderPayment) {
        result.totalRevenue += orderPayment?.amount;
      }
    });
  });

  result.last12MonthsOrder = await generateLast12MonthsData(Order);

  return result;
};

const getUserAnalyticsData = async (authUser: JwtPayload | null) => {
  const result = {
    totalOrder: 0,
    totalBuyProduct: 0,
  };

  const user = await User.findOne({ email: authUser?.email }).lean();

  result.totalOrder = await Order.count({ userId: user?._id });

  const orders = await Order.find({ userId: user?._id }, { _id: 1 });

  await asyncForEach(orders, async (order: { _id: string }) => {
    result.totalBuyProduct += await OrderItem.count({ orderId: order._id });
  });

  return result;
};

export const AnalyticsService = {
  fetchDashboardAnalyticsData,
};
