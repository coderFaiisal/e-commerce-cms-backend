import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ProductReviewController } from './productReview.controller';
import { ProductReviewValidation } from './productReview.validation';

const router = express.Router();

router.post(
  '/:id',
  validateRequest(ProductReviewValidation.createProductReviewZodSchema),
  ProductReviewController.createProductReview,
);

router.patch(
  '/:id',
  validateRequest(ProductReviewValidation.updateProductReviewZodSchema),
  ProductReviewController.updateProductReview,
);

router.delete('/:id', ProductReviewController.deleteProductReview);

export const productReviewRoutes = router;
