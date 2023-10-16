import express from 'express';
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
router.get('/', auth(), WishListController.getWishList);

router.get('/:id', auth(), WishListController.getSingleWishList);

router.delete('/:id', auth(), WishListController.deleteWishList);

export const WishListRoutes = router;
