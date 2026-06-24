import express from 'express';
import * as friendController from '../controllers/friendController';
import { requireAuth } from '../middleware';

const router = express.Router();

router.post('/requests', requireAuth, friendController.sendFriendRequest);
router.get('/', requireAuth, friendController.getFriends);
router.get('/requests', requireAuth, friendController.findRequests);
router.post('/:id/decline', requireAuth, friendController.declineRequest);
router.post('/:id/accept', requireAuth, friendController.acceptRequest);
router.delete('/:id', requireAuth, friendController.removeFriend);

export default router;
