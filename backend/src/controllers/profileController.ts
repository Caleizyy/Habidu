import { Request, Response } from 'express';
import * as sessionService from '../services/sessionService';
import { User } from '../models/user';

export const getProfile = async (req: Request, res: Response) => {
  try {
    const sessionId = req.cookies?.session;

    if (!sessionId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const session = await sessionService.getSessionById(sessionId);

    if (!session) {
      return res.status(401).json({ message: 'Invalid session' });
    }

    const user = await User.findOne({ sub: session.sub });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({
      sub: user.sub,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`.trim(),
      avatar: user.avatar,
      bio: user.bio || '',
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const sessionId = req.cookies?.session;

    if (!sessionId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const session = await sessionService.getSessionById(sessionId);

    if (!session) {
      return res.status(401).json({ message: 'Invalid session' });
    }

    const { name, bio } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ message: 'Name is required' });
    }

    if (bio && typeof bio !== 'string') {
      return res.status(400).json({ message: 'Bio must be a string' });
    }

    const [firstName, ...rest] = name.trim().split(' ');
    const lastName = rest.join(' ') || '';

    const updateData: Partial<{
      firstName: string;
      lastName: string;
      bio: string;
    }> = {};

    updateData.firstName = firstName;
    updateData.lastName = lastName;
    if (bio !== undefined) updateData.bio = bio;

    const updated = await User.findOneAndUpdate(
      { sub: session.sub },

      updateData,

      { returnDocument: 'after' }
    );

    if (!updated) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({
      sub: updated.sub,
      email: updated.email,
      name: `${updated.firstName} ${updated.lastName}`.trim(),
      avatar: updated.avatar,
      bio: updated.bio,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
