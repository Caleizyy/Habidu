import { useState } from 'react';
import { UserPlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { friendsApi } from '@/api/friends';
import { inviteMember } from '@/api/group';
import { Group } from '@/types/group';
import { User } from '@/types/index';
import { GroupInviteItem } from './GroupInviteItem';

interface Props {
  group: Group;
}

export function GroupInviteDialog({ group }: Props) {
  const [open, setOpen] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [inviting, setInviting] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) setSearch('');
    if (nextOpen && allUsers.length === 0) {
      setUsersLoading(true);
      friendsApi
        .getFriends()
        .then(setAllUsers)
        .catch(console.error)
        .finally(() => setUsersLoading(false));
    }
  }

  async function handleInvite(sub: string) {
    setInviting(sub);
    try {
      await inviteMember(group._id, sub);
      setAllUsers((prev) => prev.filter((u) => u.sub !== sub));
    } catch (err) {
      console.error(err);
    } finally {
      setInviting(null);
    }
  }

  const memberSubs = new Set(group.members.map((m) => m.sub));
  const invitableUsers = allUsers.filter((u) => !memberSubs.has(u.sub));
  const q = search.toLowerCase();
  const visibleUsers = invitableUsers.filter(
    (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
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
        <Input placeholder="Search by name or email" value={search} onChange={(e) => setSearch(e.target.value)} />
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
                key={u.sub}
                user={u}
                inviting={inviting === u.sub}
                onInvite={() => handleInvite(u.sub)}
              />
            ))}
          </ul>
        )}
        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  );
}
