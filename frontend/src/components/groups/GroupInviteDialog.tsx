import { useState } from 'react';
import { UserPlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { friendsApi } from '@/api/friends';
import { inviteMember } from '@/api/group';
import { Group } from '@/types/group';
import { Friend } from '@/types/index';
import { GroupInviteItem } from './GroupInviteItem';

interface Props {
  group: Group;
}

export function GroupInviteDialog({ group }: Props) {
  const [open, setOpen] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [inviting, setInviting] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) setSearch('');
    if (nextOpen && friends.length === 0) {
      setUsersLoading(true);
      friendsApi
        .getFriends()
        .then(setFriends)
        .catch(console.error)
        .finally(() => setUsersLoading(false));
    }
  }

  async function handleInvite(email: string) {
    setInviting(email);
    try {
      await inviteMember(group._id, email);
      setFriends((prev) => prev.filter((u) => u.email !== email));
    } catch (err) {
      console.error(err);
    } finally {
      setInviting(null);
    }
  }

  const memberEmails = new Set(group.members.map((m) => m.email));
  const invitableUsers = friends.filter((friend) => !memberEmails.has(friend.email));
  const query = search.toLowerCase();
  const visibleUsers = invitableUsers.filter(
    (friend) =>
      `${friend.firstName} ${friend.lastName}`.toLowerCase().includes(query) ||
      friend.email.toLowerCase().includes(query)
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <UserPlusIcon />
          Invite
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite to {group.name}</DialogTitle>
        </DialogHeader>
        <Input placeholder="Search by email" value={search} onChange={(e) => setSearch(e.target.value)} />
        {usersLoading && <p>Loading...</p>}
        {!usersLoading && invitableUsers.length === 0 && (
          <p className="text-muted-foreground text-sm">No friends available to invite.</p>
        )}
        {!usersLoading && invitableUsers.length > 0 && visibleUsers.length === 0 && (
          <p className="text-muted-foreground text-sm">No results for &ldquo;{search}&rdquo;.</p>
        )}
        {!usersLoading && visibleUsers.length > 0 && (
          <ul className="flex flex-col gap-2">
            {visibleUsers.map((u) => (
              <GroupInviteItem
                key={u._id}
                user={u}
                inviting={inviting === u.email}
                onInvite={() => handleInvite(u.email)}
              />
            ))}
          </ul>
        )}
        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  );
}
