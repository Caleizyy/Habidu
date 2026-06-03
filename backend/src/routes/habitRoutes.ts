import express from 'express';
import * as habitController from '../controllers/habitController';
import { validateBody } from '../middleware';
import { createHabitSchema } from '../schemas/habitSchema';
import habitLogRoutes from './habitLogRoutes';

const router = express.Router();

router.get('/', habitController.find);
router.post('/', validateBody(createHabitSchema), habitController.create);

router.use('/:habitId/logs', habitLogRoutes);

export default router;
