import express from 'express';
import * as habitController from '../controllers/habitController';
import { requireAuth } from '../middleware';

const router = express.Router();

router.get('/', requireAuth, habitController.find);
router.post('/', requireAuth, habitController.create);

export default router;
