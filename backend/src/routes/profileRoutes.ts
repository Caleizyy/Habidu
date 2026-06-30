import { Router } from 'express';
import * as profileController from '../controllers/profileController';
import { requireAuth, requireUser } from '../middleware';

const router = Router();

router.use(requireAuth, requireUser);

router.get('/me', profileController.getOwnProfile);
router.get('/:userId', profileController.getProfile);
router.patch('/me', profileController.updateProfile);

export default router;
