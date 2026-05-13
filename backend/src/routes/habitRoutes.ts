import express from 'express';
import * as habitController from '../controllers/habitController';

const router = express.Router();

router.get('/category/:category', habitController.getByCategory);
router.get('/frequency/:frequency', habitController.getByFrequency);
router.post('/', habitController.create);

export default router;
