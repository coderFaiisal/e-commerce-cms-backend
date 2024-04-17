import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { BannerController } from './banner.controller';
import { BannerValidation } from './banner.validation';

const router = express.Router();

router.post(
  '/create-banner',
  validateRequest(BannerValidation.createBannerZodSchema),
  BannerController.createBanner,
);

router.get('/:storeId', BannerController.getAllBanners);

router.get('/single-banner/:id', BannerController.getSingleBanner);

router.patch(
  '/:id',
  validateRequest(BannerValidation.updateBannerZodSchema),

  BannerController.updateBanner,
);

router.delete('/:id', BannerController.deleteBanner);

export const BannerRoutes = router;
