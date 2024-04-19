import express from 'express';
import { USER_ROLE } from '../../../constant/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { SubscriptionController } from './controller';
import { SubscriptionValidation } from './validation';

const router = express.Router();

const { store_owner, admin, super_admin } = USER_ROLE;

const { createSchema } = SubscriptionValidation;

const {
  createSubscription,
  getSingleSubscription,
  renewOrUpgradeSubscription,
  cancelSubscription,
} = SubscriptionController;

router.post(
  '/create-subscription',
  auth(store_owner),
  validateRequest(createSchema),
  createSubscription,
);

router.get(
  '/:id',
  auth(store_owner, admin, super_admin),
  getSingleSubscription,
);

router.patch(
  '/renew-or-upgrade-subscription/:id',
  auth(store_owner),
  renewOrUpgradeSubscription,
);

router.patch('/cancel-subscription/:id', auth(store_owner), cancelSubscription);

export const SubscriptionRoutes = router;
