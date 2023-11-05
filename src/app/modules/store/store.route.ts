import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { StoreController } from './store.controller';
import { StoreValidation } from './store.validation';

const router = express.Router();

router.post(
  '/create-store',
  validateRequest(StoreValidation.createStoreZodSchema),
  auth(ENUM_USER_ROLE.ADMIN),
  StoreController.createStore,
);

router.get('/:id', auth(ENUM_USER_ROLE.ADMIN), StoreController.getSingleStore);

router.patch('/:id', auth(ENUM_USER_ROLE.ADMIN), StoreController.updateStore);

router.delete('/:id', auth(ENUM_USER_ROLE.ADMIN), StoreController.deleteStore);

export const StoreRoutes = router;
