import express from 'express';
import * as notificationController from '../controllers/notificationController';
import { requireAuth } from '../middleware';

const router = express.Router();

router.patch('/:id/markAsRead', requireAuth, notificationController.markAsRead);
router.patch('/markAllAsRead', requireAuth, notificationController.markAllAsRead);
router.get('/', requireAuth, notificationController.findNotifications);

export default router;
