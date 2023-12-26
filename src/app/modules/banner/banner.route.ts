import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { BannerValidation } from './banner.validation';
import { BannerController } from './banner.controller';

const router = express.Router();

router.post(
  '/create-banner',
  validateRequest(BannerValidation.createBannerZodSchema),
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  BannerController.createBanner,
);

router.get('/:storeId', BannerController.getAllBanners);

router.get('/single-banner/:id', BannerController.getSingleBanner);

router.patch(
  '/:id',
  validateRequest(BannerValidation.updateBannerZodSchema),
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  BannerController.updateBanner,
);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  BannerController.deleteBanner,
);

export const BannerRoutes = router;
