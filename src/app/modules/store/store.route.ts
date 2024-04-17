import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { StoreController } from './store.controller';
import { StoreValidation } from './store.validation';

const router = express.Router();

router.post(
  '/create-store',
  validateRequest(StoreValidation.createStoreZodSchema),
  StoreController.createStore,
);

router.get('/isStoreExist', StoreController.isStoreExist);

router.get('/', StoreController.getAllStores);

router.get('/:id', StoreController.getSingleStore);

router.patch(
  '/:id',
  validateRequest(StoreValidation.updateStoreZodSchema),
  StoreController.updateStore,
);

router.delete('/:id', StoreController.deleteStore);

export const StoreRoutes = router;
