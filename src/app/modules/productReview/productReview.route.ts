import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ProductReviewValidation } from './productReview.validation';

const router = express.Router();

router.post(
  '/:id',
  validateRequest(ProductReviewValidation.createProductReviewZodSchema),
  auth(ENUM_USER_ROLE.USER),
);

router.patch(
  '/:id',
  validateRequest(ProductReviewValidation.updateProductReviewZodSchema),
  auth(ENUM_USER_ROLE.USER),
);

router.delete('/:id', auth(ENUM_USER_ROLE.USER));

export const productReviewRoutes = router;
