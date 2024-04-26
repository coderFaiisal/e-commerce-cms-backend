import express from 'express';
import { USER_ROLE } from '../../../constant/user';
import auth from '../../middlewares/auth';
import { NotificationController } from './controller';

const router = express.Router();

const { store_owner, admin } = USER_ROLE;

const { getAllNotifications, updateNotification } = NotificationController;

router.get('/', auth(store_owner, admin), getAllNotifications);

router.patch('/:id', auth(store_owner, admin), updateNotification);

export const NotificationRoutes = router;
