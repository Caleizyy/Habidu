export interface GroupInvite {
  _id: string;
  group: { _id: string; name: string };
  inviter: { _id: string; firstName: string; lastName: string; email: string; avatar?: string };
  status: string;
}
