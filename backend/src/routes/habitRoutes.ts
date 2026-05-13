import express from 'express';
import * as habitController from '../controllers/habitController';

const router = express.Router();

router.get('/', habitController.find);
router.post('/', habitController.create);

export default router;
