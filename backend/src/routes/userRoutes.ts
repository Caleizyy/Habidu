import express from 'express';
import * as userController from '../controllers/userController';
import { requireAuth, requireUser } from '../middleware';

const router = express.Router();

router.use(requireAuth, requireUser);

router.get('/search', userController.findUsers);

export default router;
