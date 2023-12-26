import express from 'express';
import { AdminRoutes } from '../modules/admin/admin.route';
import { AuthRoutes } from '../modules/auth/auth.route';
import { BannerRoutes } from '../modules/banner/banner.route';
import { BillboardRoutes } from '../modules/billboard/billboard.route';
import { CaratRoutes } from '../modules/carat/carat.route';
import { CategoryRoutes } from '../modules/category/category.route';
import { MaterialRoutes } from '../modules/material/material.route';
import { OrderRoutes } from '../modules/order/order.route';
import { ProductRoutes } from '../modules/product/product.route';
import { productReviewRoutes } from '../modules/productReview/productReview.route';
import { StoreRoutes } from '../modules/store/store.route';
import { UserRoutes } from '../modules/user/user.route';

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
    path: '/banners',
    route: BannerRoutes,
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
  {
    path: '/productReviews',
    route: productReviewRoutes,
  },
  {
    path: '/carats',
    route: CaratRoutes,
  },
  {
    path: '/materials',
    route: MaterialRoutes,
  },
  {
    path: '/orders',
    route: OrderRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
