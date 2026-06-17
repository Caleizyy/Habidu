import { Request, Response } from 'express';
import { IUser } from '../models/user';
import * as groupService from '../services/groupService';

const ERROR_STATUS: Record<string, number> = {
  'Only the group owner can invite members': 403,
  'Group not found': 404,
  'User not found': 404,
  'User is already a member': 400,
  'Invite already sent': 400,
};

export const findGroups = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user as IUser;
    const groups = await groupService.list(user);
    return res.json(groups);
  } catch (error) {
    console.error('Error fetching groups:', error);
    return res.status(500).json({ error: 'Failed to fetch groups' });
  }
};

export const createGroup = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user as IUser;
    const group = await groupService.create(req.body.name, user);
    return res.status(201).json(group);
  } catch (error) {
    console.error('Error creating group:', error);
    return res.status(500).json({ error: 'Failed to create group' });
  }
};

export const getGroup = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const group = await groupService.getById(req.params.id);
    if (!group) return res.status(404).json({ error: 'Group not found' });
    return res.json(group);
  } catch (error) {
    console.error('Error fetching group:', error);
    return res.status(500).json({ error: 'Failed to fetch group' });
  }
};

export const inviteMember = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const user = res.locals.user as IUser;
    await groupService.invite(req.params.id, req.body.sub, user);
    return res.status(201).json({ message: 'Invite sent' });
  } catch (error) {
    const msg = error instanceof Error ? error.message : '';
    const status = ERROR_STATUS[msg];
    if (status) return res.status(status).json({ error: msg });
    console.error('Error inviting member:', error);
    return res.status(500).json({ error: 'Failed to invite member' });
  }
};
