import express from 'express';
import * as friendController from '../controllers/friendController';

const router = express.Router();

router.post('/', friendController.sendFriendRequest);

export default router;
