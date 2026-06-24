export interface User {
  _id: string;
  sub: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  bio?: string;
  name: string;
}
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
  signin: () => void;
  logout: () => void;
}
export enum FriendRequestStatus {
  Pending = 'pending',
  Accepted = 'accepted',
  Rejected = 'rejected',
  Blocked = 'blocked',
}
export interface FriendRequest {
  _id: string;
  recipientId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string;
  };
  requesterId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string;
  };
  status: FriendRequestStatus;
  friendRequestId: string;
}

export interface Friend {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  friendRequestId: string;
}

export interface Profile {
  sub: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
}
