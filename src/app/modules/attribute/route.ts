import express from 'express';
import { USER_ROLE } from '../../../constant/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { AttributeController } from './controller';
import { AttributeValidation } from './validation';

const router = express.Router();

const { store_owner } = USER_ROLE;

const { createSchema, updateSchema } = AttributeValidation;

const {
  createAttribute,
  getAllAttributes,
  getSingleAttribute,
  updateAttribute,
  deleteAttribute,
} = AttributeController;

router.post(
  '/create',
  auth(store_owner),
  validateRequest(createSchema),
  createAttribute,
);

router.get('/:storeId', getAllAttributes);

router.get('/single-attribute/:id', getSingleAttribute);

router.patch(
  '/:id',
  auth(store_owner),
  validateRequest(updateSchema),
  updateAttribute,
);

router.delete('/:id', auth(store_owner), deleteAttribute);

export const AttributeRoutes = router;
