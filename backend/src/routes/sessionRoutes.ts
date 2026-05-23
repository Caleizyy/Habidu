import { Router } from 'express';
import * as sessionController from '../controllers/sessionController';

const router = Router();

router.get('/me', sessionController.sessionCheck);

export default router;
