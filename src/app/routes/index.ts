import express from 'express';
import { BannerRoutes } from '../modules/banner/banner.route';
import { BillboardRoutes } from '../modules/billboard/billboard.route';
import { CaratRoutes } from '../modules/carat/carat.route';
import { CategoryRoutes } from '../modules/category/category.route';
import { MaterialRoutes } from '../modules/material/material.route';
import { OrderRoutes } from '../modules/order/order.route';
import { ProductRoutes } from '../modules/product/product.route';
import { productReviewRoutes } from '../modules/productReview/productReview.route';
import { StoreRoutes } from '../modules/store/store.route';
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
