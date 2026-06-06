import express from 'express';
import * as friendController from '../controllers/friendController';

const router = express.Router();

router.post('/requests', friendController.sendFriendRequest);
router.get('/', friendController.getFriends);

export default router;
