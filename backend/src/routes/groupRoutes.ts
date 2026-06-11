import { Router } from 'express';
import { Types } from 'mongoose';
import { requireAuth } from '../middleware';
import * as authService from '../services/authService';

interface StubUser {
  sub: string;
  name: string;
  email: string;
  avatar?: string;
}

interface StubGroup {
  _id: string;
  name: string;
  owner: string;
  members: StubUser[];
}

const groups = new Map<string, StubGroup>();

const router = Router();
router.use(requireAuth);

router.get('/', (_req, res) => {
  const sub = res.locals.sub as string;
  const userGroups = Array.from(groups.values()).filter((g) => g.members.some((m) => m.sub === sub));
  return res.json(userGroups);
});

router.post('/', async (req, res) => {
  const { name } = req.body as { name?: string };
  if (!name || !name.trim()) return res.status(400).json({ error: 'Group name is required' });

  const sub = res.locals.sub as string;
  const dbUser = await authService.getBySub(sub);
  if (!dbUser) return res.status(401).json({ error: 'User not found' });

  const owner: StubUser = {
    sub: dbUser.sub,
    name: `${dbUser.firstName} ${dbUser.lastName}`,
    email: dbUser.email,
    avatar: dbUser.avatar,
  };

  const group: StubGroup = {
    _id: new Types.ObjectId().toHexString(),
    name: name.trim(),
    owner: sub,
    members: [owner],
  };

  groups.set(group._id, group);
  return res.status(201).json(group);
});

router.get('/:id', (req, res) => {
  const group = groups.get(req.params.id);
  if (!group) return res.status(404).json({ error: 'Group not found' });
  return res.json(group);
});

router.post('/:id/invite', async (req, res) => {
  const group = groups.get(req.params.id);
  if (!group) return res.status(404).json({ error: 'Group not found' });

  const sub = res.locals.sub as string;
  if (group.owner !== sub) return res.status(403).json({ error: 'Only the group owner can invite members' });

  const { sub: inviteeSub } = req.body as { sub?: string };
  if (!inviteeSub) return res.status(400).json({ error: 'sub is required' });

  if (group.members.some((m) => m.sub === inviteeSub)) {
    return res.status(400).json({ error: 'User is already a member' });
  }

  const invitee = await authService.getBySub(inviteeSub);
  if (!invitee) return res.status(404).json({ error: 'User not found' });

  group.members.push({
    sub: invitee.sub,
    name: `${invitee.firstName} ${invitee.lastName}`,
    email: invitee.email,
    avatar: invitee.avatar,
  });

  return res.json(group);
});

export default router;
