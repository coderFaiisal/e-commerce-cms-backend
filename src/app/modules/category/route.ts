import express from 'express';
import { USER_ROLE } from '../../../constant/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { CategoryController } from './controller';
import { CategoryValidation } from './validation';

const router = express.Router();

const { store_owner } = USER_ROLE;

const { createSchema, updateSchema } = CategoryValidation;

const {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
} = CategoryController;

router.post(
  '/create',
  auth(store_owner),
  validateRequest(createSchema),
  createCategory,
);

router.get('/:storeId', getAllCategories);

router.get('/single-category/:id', getSingleCategory);

router.patch(
  '/:id',
  auth(store_owner),
  validateRequest(updateSchema),
  updateCategory,
);

router.delete('/:id', auth(store_owner), deleteCategory);

export const CategoryRoutes = router;
