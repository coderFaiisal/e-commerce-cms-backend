import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { MaterialController } from './material.controller';
import { MaterialValidation } from './material.validation';

const router = express.Router();

router.post(
  '/create-material',
  validateRequest(MaterialValidation.createMaterialZodSchema),
  auth(ENUM_USER_ROLE.ADMIN),
  MaterialController.createMaterial,
);

router.get(
  '/:storeId',
  auth(ENUM_USER_ROLE.ADMIN),
  MaterialController.getAllMaterials,
);

router.get(
  '/single-material/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  MaterialController.getSingleMaterial,
);

router.patch(
  '/:id',
  validateRequest(MaterialValidation.updateMaterialZodSchema),
  auth(ENUM_USER_ROLE.ADMIN),
  MaterialController.updateMaterial,
);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  MaterialController.deleteMaterial,
);

export const MaterialRoutes = router;
