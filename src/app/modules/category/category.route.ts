import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { CategoryController } from './category.controller';
import { CategoryValidation } from './category.validation';

const router = express.Router();

router.post(
  '/create-category',
  validateRequest(CategoryValidation.createCategoryZodSchema),
  auth(ENUM_USER_ROLE.ADMIN),
  CategoryController.createCategory,
);

router.get('/', CategoryController.getAllCategories);

router.get('/:id', CategoryController.getSingleCategory);

router.patch(
  '/:id',
  validateRequest(CategoryValidation.updateCategoryZodSchema),
  auth(ENUM_USER_ROLE.ADMIN),
  CategoryController.updateCategory,
);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  CategoryController.deleteCategory,
);

export const CategoryRoutes = router;
