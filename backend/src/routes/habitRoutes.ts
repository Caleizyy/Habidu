import express from 'express';
import * as habitController from '../controllers/habitController';
import habitLogRoutes from './habitLogRoutes';

const router = express.Router();

router.get('/', habitController.find);
router.post('/', habitController.create);

router.use('/:habitId/logs', habitLogRoutes);

export default router;
