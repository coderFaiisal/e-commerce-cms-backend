import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ProductReviewController } from './productReview.controller';
import { ProductReviewValidation } from './productReview.validation';

const router = express.Router();

router.post(
  '/:id',
  validateRequest(ProductReviewValidation.createProductReviewZodSchema),
  auth(ENUM_USER_ROLE.USER),
  ProductReviewController.createProductReview,
);

router.patch(
  '/:id',
  validateRequest(ProductReviewValidation.updateProductReviewZodSchema),
  auth(ENUM_USER_ROLE.USER),
  ProductReviewController.updateProductReview,
);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.USER),
  ProductReviewController.deleteProductReview,
);

export const productReviewRoutes = router;
