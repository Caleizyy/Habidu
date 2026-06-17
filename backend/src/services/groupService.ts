import { Types } from 'mongoose';
import { IUser } from '../models/user';
import { GroupRequestStatus, PopulatedUser } from '../types';
import * as groupRepository from '../repositories/groupRepository';
import * as groupRequestRepository from '../repositories/groupRequestRepository';
import * as userRepository from '../repositories/userRepository';

interface PopulatedGroup {
  _id: Types.ObjectId;
  name: string;
  owner: PopulatedUser;
  members: PopulatedUser[];
}

function mapGroup(group: PopulatedGroup) {
  return {
    _id: group._id,
    name: group.name,
    owner: group.owner.sub,
    members: group.members.map((m) => ({
      sub: m.sub,
      name: `${m.firstName} ${m.lastName}`,
      email: m.email,
      avatar: m.avatar,
    })),
  };
}

export async function list(user: IUser) {
  const groups = await groupRepository.findByMember(user._id as Types.ObjectId);
  return groups.map((g) => mapGroup(g as unknown as PopulatedGroup));
}

export async function getById(id: string) {
  const group = await groupRepository.findById(id);
  if (!group) return null;
  return mapGroup(group as unknown as PopulatedGroup);
}

export async function create(name: string, user: IUser) {
  const userId = user._id as Types.ObjectId;
  const group = await groupRepository.create({ name, owner: userId, members: [userId] });
  return {
    _id: group._id,
    name: group.name,
    owner: user.sub,
    members: [{ sub: user.sub, name: `${user.firstName} ${user.lastName}`, email: user.email, avatar: user.avatar }],
  };
}

export async function invite(groupId: string, inviteeSub: string, inviter: IUser) {
  const group = await groupRepository.findById(groupId);
  if (!group) throw new Error('Group not found');

  const populated = group as unknown as PopulatedGroup;
  if (!populated.owner._id.equals(inviter._id as Types.ObjectId)) {
    throw new Error('Only the group owner can invite members');
  }

  const invitee = await userRepository.getBySub(inviteeSub);
  if (!invitee) throw new Error('User not found');

  const inviteeId = invitee._id as Types.ObjectId;

  if (populated.members.some((m) => m._id.equals(inviteeId))) {
    throw new Error('User is already a member');
  }

  const pending = await groupRequestRepository.findPending(group._id as Types.ObjectId, inviteeId);
  if (pending) throw new Error('Invite already sent');

  await groupRequestRepository.create({
    group: group._id as Types.ObjectId,
    inviter: inviter._id as Types.ObjectId,
    invitee: inviteeId,
    status: GroupRequestStatus.Pending,
  });
}
