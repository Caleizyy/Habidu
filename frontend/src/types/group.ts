import { User } from '@/types/index';

export interface Group {
  _id: string;
  name: string;
  owner: string;
  members: User[];
  pendingInvites: string[];
}
