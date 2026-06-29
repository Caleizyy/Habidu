import express from 'express';
import * as friendController from '../controllers/friendController';
import { requireAuth, requireUser } from '../middleware';

const router = express.Router();

router.use(requireAuth, requireUser);

router.post('/requests', friendController.sendFriendRequest);
router.get('/', friendController.getFriends);
router.get('/requests', friendController.findRequests);
router.post('/:id/decline', friendController.declineRequest);
router.post('/:id/accept', friendController.acceptRequest);
router.delete('/:id', friendController.removeFriend);

export default router;
