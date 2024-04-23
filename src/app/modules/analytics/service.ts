import { JwtPayload } from 'jsonwebtoken';
import { USER_ROLE } from '../../../constant/user';
import { Order } from '../order/model';
import { Store } from '../store/model';
import { Subscription } from '../subscription/model';
import { User } from '../user/model';

//! Have to update analytics service code.

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
  const storeOwnerCount = await User.count({ role: USER_ROLE.store_owner });
  const adminCount = await User.count({ role: USER_ROLE.admin });
  const totalSubscriptionCount = await Subscription.count();
  const activeSubscriptionCount = await Subscription.count({ isActive: true });
  const cancelSubscriptionCount = await Subscription.count({ isActive: false });
  //   const paymentCount = await Payment.count()

  //   const totalRevenue = await Payment.aggregate({
  //     _sum: { amount: true },
  //     where: {
  //       status: PaymentStatus.PAID,
  //     },
  //   });

  const barChartData = await getBarChartData();
  const pieCharData = await getPieChartData();

  return {
    userCount,
    storeOwnerCount,
    totalSubscriptionCount,
    activeSubscriptionCount,
    cancelSubscriptionCount,
    adminCount,
    // paymentCount,
    // totalRevenue,
    barChartData,
    pieCharData,
  };
};

const getAdminAnalyticsData = async () => {
  const userCount = await User.count({ role: USER_ROLE.user });
  const storeOwnerCount = await User.count({ role: USER_ROLE.store_owner });
  const totalSubscriptionCount = await Subscription.count();
  const activeSubscriptionCount = await Subscription.count({ isActive: true });
  const cancelSubscriptionCount = await Subscription.count({ isActive: false });
  //   const paymentCount = await Payment.count()

  //   const totalRevenue = await Payment.aggregate({
  //     _sum: { amount: true },
  //     where: {
  //       status: PaymentStatus.PAID,
  //     },
  //   });

  const barChartData = await getBarChartData();
  const pieCharData = await getPieChartData();

  return {
    userCount,
    storeOwnerCount,
    totalSubscriptionCount,
    activeSubscriptionCount,
    cancelSubscriptionCount,
    // paymentCount,
    // totalRevenue,
    barChartData,
    pieCharData,
  };
};

const getStoreOwnerAnalyticsData = async (authUser: JwtPayload | null) => {
  const storeOwner = await User.findOne({ email: authUser?.email }).lean();

  const totalStore = await Store.count({ userId: storeOwner?._id });

  //! Have to try aggregation and operator for find and match this store owner total billboard, category, product etc.

  return {
    totalStore,
  };
};

const getUserAnalyticsData = async (authUser: JwtPayload | null) => {
  const user = await User.findOne({ email: authUser?.email }).lean();

  const totalOrder = await Order.count({ userId: user?._id });

  //! Have to try aggregation and operator for find and match this user total payment and info.

  return {
    totalOrder,
  };
};

const getBarChartData = async () => {
  //   const appointmentCountByMonth: { month: Date; count: bigint }[] =
  //     await prisma.$queryRaw`
  //         SELECT DATE_TRUNC('month', "createdAt") AS month,
  //         CAST(COUNT(*) AS INTEGER) AS count
  //         FROM "appointments"
  //         GROUP BY month
  //         ORDER BY month ASC
  //     `;

  return '';
};

const getPieChartData = async () => {
  //   const appointmentStatusDistribution = await prisma.appointment.groupBy({
  //     by: ['status'],
  //     _count: { id: true },
  //   });

  //   const formattedAppointmentStatusDistribution =
  //     appointmentStatusDistribution.map(({ status, _count }) => ({
  //       status,
  //       count: Number(_count.id),
  //     }));

  return '';
};

export const AnalyticsService = {
  fetchDashboardAnalyticsData,
};
