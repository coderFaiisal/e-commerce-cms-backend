import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post('/create-store', auth(ENUM_USER_ROLE.ADMIN));

router.get('/:id', auth(ENUM_USER_ROLE.ADMIN));

router.patch('/:id', auth(ENUM_USER_ROLE.ADMIN));

router.delete('/:id', auth(ENUM_USER_ROLE.ADMIN));

export const StoreRoutes = router;