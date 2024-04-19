import express from 'express';
import { USER_ROLE } from '../../../constant/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { StoreController } from './controller';
import { StoreValidation } from './validation';

const router = express.Router();

const { store_owner } = USER_ROLE;

const { createSchema, updateSchema } = StoreValidation;

const {
  createStore,
  isStoreExist,
  getAllStores,
  getSingleStore,
  updateStore,
  deleteStore,
} = StoreController;

router.post(
  '/create-store',
  auth(store_owner),
  validateRequest(createSchema),
  createStore,
);

router.get('/isStoreExist', auth(store_owner), isStoreExist);

router.get('/', auth(store_owner), getAllStores);

router.get('/:id', auth(store_owner), getSingleStore);

router.patch(
  '/:id',
  auth(store_owner),
  validateRequest(updateSchema),
  updateStore,
);

router.delete('/:id', auth(store_owner), deleteStore);

export const StoreRoutes = router;
