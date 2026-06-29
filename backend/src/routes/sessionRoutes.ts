import { Router } from 'express';
import * as sessionController from '../controllers/sessionController';

const router = Router();

router.get('/me', sessionController.sessionCheck);
router.delete('/', sessionController.logout);

export default router;
