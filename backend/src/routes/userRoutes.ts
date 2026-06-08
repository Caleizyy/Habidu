import express from 'express';
import * as userController from '../controllers/userController';
import { requireAuth } from '../middleware';

const router = express.Router();

router.get('/search', requireAuth, userController.findUsers);

export default router;
