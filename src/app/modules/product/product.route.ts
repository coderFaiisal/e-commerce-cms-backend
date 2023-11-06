import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ENUM_USER_ROLE } from './../../../enums/user';
import { ProductController } from './product.controller';
import { ProductValidation } from './product.validation';

const router = express.Router();

router.post(
  '/create-product',
  validateRequest(ProductValidation.createProductZodSchema),
  auth(ENUM_USER_ROLE.ADMIN),
  ProductController.createProduct,
);

router.get('/', ProductController.getAllProducts);

router.get('/:id', ProductController.getSingleProduct);

router.patch(
  '/:id',
  validateRequest(ProductValidation.updateProductZodSchema),
  auth(ENUM_USER_ROLE.ADMIN),
  ProductController.updateProduct,
);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  ProductController.deleteProduct,
);

export const ProductRoutes = router;
