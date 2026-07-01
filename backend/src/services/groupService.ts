import { Types } from 'mongoose';
import { IUser } from '../models/user';
import { GroupRequestStatus, PopulatedGroup } from '../types';
import * as groupRepository from '../repositories/groupRepository';
import * as groupRequestRepository from '../repositories/groupRequestRepository';
import * as userRepository from '../repositories/userRepository';
import * as friendService from './friendService';
import * as notificationService from './notificationService';

function assertOwner(group: PopulatedGroup, user: IUser) {
  if (!group.owner._id.equals(user._id as Types.ObjectId)) {
    throw new Error('Only the group owner can invite members');
  }
}

function mapGroup(group: PopulatedGroup) {
  return {
    _id: group._id,
    name: group.name,
    owner: group.owner.sub,
    members: group.members.map((m) => ({
      _id: m._id,
      sub: m.sub,
      firstName: m.firstName,
      lastName: m.lastName,
      email: m.email,
      avatar: m.avatar,
    })),
  };
}

export async function list(user: IUser) {
  const groups = await groupRepository.findByMember(user._id as Types.ObjectId);
  return groups.map(mapGroup);
}

export async function getById(id: string, requestingUser: IUser) {
  const [group, pendingRequests] = await Promise.all([
    groupRepository.findById(id),
    groupRequestRepository.findPendingByGroup(id),
  ]);
  if (!group) return null;
  const isMember = group.members.some((m) => m._id.equals(requestingUser._id as Types.ObjectId));
  if (!isMember) throw new Error('Not a group member');
  const pendingInvites = pendingRequests.map((r) => (r.invitee as unknown as { email: string }).email);
  return { ...mapGroup(group), pendingInvites };
}

export async function create(name: string, user: IUser) {
  const userId = user._id as Types.ObjectId;
  const group = await groupRepository.create({ name, owner: userId, members: [userId] });
  return {
    _id: group._id,
    name: group.name,
    owner: user.sub,
    members: [
      {
        _id: user._id,
        sub: user.sub,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        avatar: user.avatar,
      },
    ],
    pendingInvites: [],
  };
}

export async function getInviteableFriends(groupId: string, user: IUser) {
  const [friends, group, pendingRequests] = await Promise.all([
    friendService.getFriends(user._id as Types.ObjectId),
    groupRepository.findById(groupId),
    groupRequestRepository.findPendingByGroup(groupId),
  ]);
  if (!group) throw new Error('Group not found');
  assertOwner(group, user);
  const memberEmails = new Set(group.members.map((m) => m.email));
  const pendingEmails = new Set(pendingRequests.map((r) => (r.invitee as unknown as { email: string }).email));
  return friends.filter((f) => !memberEmails.has(f.email) && !pendingEmails.has(f.email));
}

export async function invite(groupId: string, email: string, inviter: IUser) {
  const group = await groupRepository.findById(groupId);
  if (!group) throw new Error('Group not found');

  assertOwner(group, inviter);

  const [recipient, friends] = await Promise.all([
    userRepository.getByEmail(email),
    friendService.getFriends(inviter._id as Types.ObjectId),
  ]);
  if (!recipient) throw new Error('User not found');
  if (!friends.some((f) => f._id.equals(recipient._id))) throw new Error('Invitee is not a friend');

  const inviteeId = recipient._id as Types.ObjectId;

  if (group.members.some((m) => m._id.equals(inviteeId))) {
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

  await notificationService.createNotification({
    recipientId: inviteeId,
    message: 'You have been invited to a group!',
    pageRef: '/requests',
    actorRef: inviter._id as Types.ObjectId,
  });
}

export async function getInvites(user: IUser) {
  return await groupRequestRepository.findPendingByInvitee(user._id as Types.ObjectId);
}

export async function acceptInvite(groupId: string, user: IUser) {
  const groupInvite = await groupRequestRepository.findById(groupId);
  if (!groupInvite) throw new Error('Group request does not exist');

  if (!groupInvite.invitee.equals(user._id)) {
    throw new Error('Unidentified user attempted to accept group invite request');
  }

  const updatedRequest = await groupRequestRepository.acceptGroupRequest(groupId);
  const updatedGroup = await groupRepository.addMember(groupInvite.group.toString(), user._id as Types.ObjectId);
  await notificationService.createNotification({
    recipientId: groupInvite.inviter,
    message: 'Your group invite got accepted!',
    pageRef: '/requests',
    actorRef: groupInvite.invitee,
  });
  return { updatedRequest, updatedGroup };
}

export async function declineInvite(groupId: string, user: IUser) {
  const groupInvite = await groupRequestRepository.findById(groupId);
  if (!groupInvite) throw new Error('Group request does not exist');

  if (!groupInvite.invitee.equals(user._id)) {
    throw new Error('Unidentified user attempted to decline group invite request');
  }

  return groupRequestRepository.declineGroupRequest(groupId);
}

export async function leaveGroup(groupId: string, user: IUser) {
  const group = await groupRepository.findById(groupId);
  if (!group) throw new Error('Group does not exist');
  if (group.owner._id.equals(user._id as Types.ObjectId)) {
    throw new Error('The group leader cannot leave the group. Consider deleting instead');
  }

  return groupRepository.removeMember(groupId, user._id as Types.ObjectId);
}
