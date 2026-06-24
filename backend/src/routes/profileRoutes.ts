import { Router } from 'express';
import * as profileController from '../controllers/profileController';

const router = Router();

router.get('/me', profileController.getProfile);
router.patch('/me', profileController.updateProfile);

export default router;
