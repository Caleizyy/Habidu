import { Request, Response } from 'express';
import { Types } from 'mongoose';
import * as userService from '../services/userService';
import { User, IUser } from '../models/user';

function serializeProfile(user: IUser) {
  return {
    sub: user.sub,
    email: user.email,
    name: `${user.firstName} ${user.lastName}`.trim(),
    avatar: user.avatar,
    bio: user.bio || '',
  };
}

export const getOwnProfile = (req: Request, res: Response) => {
  return res.json(serializeProfile(res.locals.user as IUser));
};

export const getProfile = async (req: Request<{ userId: string }>, res: Response) => {
  try {
    const { userId } = req.params;

    if (!Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await userService.getUserById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json(serializeProfile(user));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
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

    const updated = await User.findOneAndUpdate({ sub: res.locals.sub }, updateData, { returnDocument: 'after' });

    if (!updated) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(serializeProfile(updated));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
