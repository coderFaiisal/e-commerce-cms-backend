import express from 'express';
import { USER_ROLE } from '../../../constant/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ProductController } from './controller';
import { ProductValidation } from './validation';

const router = express.Router();

const { store_owner } = USER_ROLE;

const { createSchema, updateSchema } = ProductValidation;

const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} = ProductController;

router.post(
  '/create',
  auth(store_owner),
  validateRequest(createSchema),
  createProduct,
);

router.get('/:storeId', getAllProducts);

router.get('/single-product/:id', getSingleProduct);

router.patch(
  '/:id',
  auth(store_owner),
  validateRequest(updateSchema),
  updateProduct,
);

router.delete('/:id', auth(store_owner), deleteProduct);

export const ProductRoutes = router;
