import express from 'express';
import { AnalyticsRoutes } from '../modules/analytics/route';
import { AttributeRoutes } from '../modules/attribute/route';
import { BillboardRoutes } from '../modules/billboard/route';
import { CategoryRoutes } from '../modules/category/route';
import { OrderRoutes } from '../modules/order/route';
import { PaymentRoutes } from '../modules/payment/route';
import { ProductRoutes } from '../modules/product/route';
import { ProductReviewRoutes } from '../modules/productReview/route';
import { StoreRoutes } from '../modules/store/route';
import { SubscriptionRoutes } from '../modules/subscription/route';
import { UserRoutes } from '../modules/user/route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/stores',
    route: StoreRoutes,
  },
  {
    path: '/subscriptions',
    route: SubscriptionRoutes,
  },
  {
    path: '/billboards',
    route: BillboardRoutes,
  },
  {
    path: '/categories',
    route: CategoryRoutes,
  },
  {
    path: '/attributes',
    route: AttributeRoutes,
  },
  {
    path: '/products',
    route: ProductRoutes,
  },
  {
    path: '/product-reviews',
    route: ProductReviewRoutes,
  },
  {
    path: '/orders',
    route: OrderRoutes,
  },
  {
    path: '/analytics',
    route: AnalyticsRoutes,
  },
  {
    path: '/payments',
    route: PaymentRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
