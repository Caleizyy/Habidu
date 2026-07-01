import { Router } from 'express';
import { requireAuth, requireUser, validateBody } from '../middleware';
import { createGroupSchema, inviteMemberSchema } from '../schemas/groupSchema';
import * as groupController from '../controllers/groupController';

const router = Router();
router.use(requireAuth, requireUser);

router.get('/', groupController.findGroups);
router.get('/invites', groupController.getInvites);
router.post('/', validateBody(createGroupSchema), groupController.createGroup);
router.get('/:id', groupController.getGroup);
router.get('/:id/inviteable-friends', groupController.getInviteableFriends);
router.post('/:id/invite', validateBody(inviteMemberSchema), groupController.inviteMember);
router.post('/:id/accept', groupController.acceptInvite);
router.post('/:id/decline', groupController.declineInvite);
router.post('/:id/leave', groupController.leaveGroup);

export default router;
