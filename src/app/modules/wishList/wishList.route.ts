import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { WishListController } from './wishList.controller';
import { WishListValidation } from './wishList.validation';

const router = express.Router();

router.post(
  '/create-wishList',
  validateRequest(WishListValidation.createWishListZodSchema),
  WishListController.createWishList,
);
router.get('/', auth(ENUM_USER_ROLE.USER), WishListController.getWishList);

router.get(
  '/:id',
  auth(ENUM_USER_ROLE.USER),
  WishListController.getSingleWishList,
);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.USER),
  WishListController.deleteWishList,
);

export const WishListRoutes = router;
