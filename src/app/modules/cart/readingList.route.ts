import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ReadingListController } from './readingList.controller';
import { ReadingListValidation } from './readingList.validation';

const router = express.Router();

router.post(
  '/create-readingList',
  validateRequest(ReadingListValidation.createReadingListZodSchema),
  ReadingListController.createReadingList,
);

router.get('/', auth(), ReadingListController.getReadingLists);

router.get('/:id', auth(), ReadingListController.getSingleReadingLists);

router.patch(
  '/:id',
  auth(),
  validateRequest(ReadingListValidation.updateReadingListZodSchema),
  ReadingListController.updateReadingList,
);

router.delete('/:id', auth(), ReadingListController.deleteReadingList);

export const ReadingListRoutes = router;
