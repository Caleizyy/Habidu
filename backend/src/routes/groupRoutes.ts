import { Router } from 'express';
import { requireAuth, requireUser, validateBody } from '../middleware';
import { createGroupSchema, inviteMemberSchema } from '../schemas/groupSchema';
import * as groupController from '../controllers/groupController';

const router = Router();
router.use(requireAuth, requireUser);

router.get('/', groupController.findGroups);
router.post('/', validateBody(createGroupSchema), groupController.createGroup);
router.get('/:id', groupController.getGroup);
router.post('/:id/invite', validateBody(inviteMemberSchema), groupController.inviteMember);

export default router;
