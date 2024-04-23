import express from 'express';
import { USER_ROLE } from '../../../constant/user';
import auth from '../../middlewares/auth';
import { AnalyticsController } from './controller';

const router = express.Router();

const { user, store_owner, admin, super_admin } = USER_ROLE;

router.get(
  '/',
  auth(user, store_owner, admin, super_admin),
  AnalyticsController.fetchDashboardAnalyticsData,
);

export const AnalyticsRoutes = router;
