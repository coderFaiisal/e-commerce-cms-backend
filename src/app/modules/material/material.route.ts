import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { MaterialController } from './material.controller';
import { MaterialValidation } from './material.validation';

const router = express.Router();

router.post(
  '/create',
  validateRequest(MaterialValidation.createMaterialZodSchema),
  MaterialController.createMaterial,
);

router.get('/:storeId', MaterialController.getAllMaterials);

router.get('/single-material/:id', MaterialController.getSingleMaterial);

router.patch(
  '/:id',
  validateRequest(MaterialValidation.updateMaterialZodSchema),
  MaterialController.updateMaterial,
);

router.delete('/:id', MaterialController.deleteMaterial);

export const MaterialRoutes = router;
