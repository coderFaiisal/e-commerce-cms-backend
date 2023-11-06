import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { CategoryValidation } from './category.validation';

const router = express.Router();

router.post(
  '/create-category',
  validateRequest(CategoryValidation.createCategoryZodSchema),
  auth(ENUM_USER_ROLE.ADMIN),
);

router.get('/');

router.get('/:id');

router.patch('/:id', auth(ENUM_USER_ROLE.ADMIN));

router.delete('/:id', auth(ENUM_USER_ROLE.ADMIN));

export const CategoryRoutes = router;
