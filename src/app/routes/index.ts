import express from 'express';
import { AdminRoutes } from '../modules/admin/admin.route';
import { AuthRoutes } from '../modules/auth/auth.route';
import { OrderRoutes } from '../modules/order/order.route';
import { ProductRoutes } from '../modules/product/product.route';
import { UserRoutes } from '../modules/user/user.route';
import { StoreRoutes } from '../modules/store/store.route';
import { BillboardRoutes } from '../modules/billboard/billboard.route';
import { CategoryRoutes } from '../modules/category/category.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/admins',
    route: AdminRoutes,
  },
  {
    path: '/stores',
    route: StoreRoutes,
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
    path: '/products',
    route: ProductRoutes,
  },
  //
  // {
  //   path: '/carats',
  //   route: CaratRoutes,
  // },
  {
    path: '/orders',
    route: OrderRoutes,
  },
  // {
  //   path: '/addReviews',
  //   route: AddReviewRoutes,
  // },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
