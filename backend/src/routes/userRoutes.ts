import express from 'express';
import * as userController from '../controllers/userController';

const router = express.Router();

router.get('/search', userController.findUsers);

export default router;
