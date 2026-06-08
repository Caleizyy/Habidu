import express from 'express';
import * as friendController from '../controllers/friendController';
import { requireAuth } from '../middleware';

const router = express.Router();

router.post('/requests', requireAuth, friendController.sendFriendRequest);
router.get('/', requireAuth, friendController.getFriends);

export default router;
