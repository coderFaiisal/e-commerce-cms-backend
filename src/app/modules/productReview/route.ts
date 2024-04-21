import express from 'express';
import { USER_ROLE } from '../../../constant/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ProductReviewController } from './controller';
import { ProductReviewValidation } from './validation';

const router = express.Router();

const { user } = USER_ROLE;

const { createSchema, updateSchema } = ProductReviewValidation;

const {
  createProductReview,
  getAllProductReviews,
  updateProductReview,
  deleteProductReview,
} = ProductReviewController;

router.post(
  '/create',
  auth(user),
  validateRequest(createSchema),
  createProductReview,
);

router.get('/:productId', getAllProductReviews);

router.patch(
  '/:id',
  auth(user),
  validateRequest(updateSchema),
  updateProductReview,
);

router.delete('/:id', auth(user), deleteProductReview);

export const ProductReviewRoutes = router;
