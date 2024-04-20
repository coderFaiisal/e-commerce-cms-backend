import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ProductController } from './product.controller';
import { ProductValidation } from './product.validation';

const router = express.Router();

router.post(
  '/create',
  validateRequest(ProductValidation.createProductZodSchema),
  ProductController.createProduct,
);

router.get('/:storeId', ProductController.getAllProducts);

router.get('/single-product/:id', ProductController.getSingleProduct);

router.patch(
  '/:id',
  validateRequest(ProductValidation.updateProductZodSchema),
  ProductController.updateProduct,
);

router.delete('/:id', ProductController.deleteProduct);

export const ProductRoutes = router;
