import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ENUM_USER_ROLE } from './../../../enums/user';
import { ProductController } from './product.controller';
import { ProductValidation } from './product.validation';

const router = express.Router();

router.post(
  '/create-product',
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(ProductValidation.createProductZodSchema),
  ProductController.createProduct,
);

router.post(
  '/add-review/:id',
  validateRequest(ProductValidation.productReviewZodSchema),
  ProductController.productReview,
);

router.get('/:id', ProductController.getSingleProduct);

router.get('/', ProductController.getAllProducts);

router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(ProductValidation.updateProductZodSchema),
  ProductController.updateProduct,
);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  ProductController.deleteProduct,
);

export const ProductRoutes = router;
