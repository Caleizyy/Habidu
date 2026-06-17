import { useState } from 'react';
import { UserPlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { fetchInviteableFriends, inviteMember } from '@/api/group';
import { Group } from '@/types/group';
import { Friend } from '@/types/index';
import { GroupInviteItem } from './GroupInviteItem';

interface Props {
  group: Group;
}

export function GroupInviteDialog({ group }: Props) {
  const [open, setOpen] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingEmails, setPendingEmails] = useState<string[]>(group.pendingInvites);
  const [loading, setLoading] = useState(false);
  const [inviting, setInviting] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) setSearch('');
    if (nextOpen && friends.length === 0) {
      setLoading(true);
      fetchInviteableFriends(group._id)
        .then(setFriends)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }

  async function handleInvite(email: string) {
    setInviting(email);
    try {
      await inviteMember(group._id, email);
      setPendingEmails((prev) => [...prev, email]);
    } catch (err) {
      console.error(err);
    } finally {
      setInviting(null);
    }
  }

  const pendingSet = new Set(pendingEmails);
  const query = search.toLowerCase();
  const visibleUsers = friends.filter(
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
        {loading && <p>Loading...</p>}
        {!loading && (
          <>
            {friends.length === 0 && <p className="text-muted-foreground text-sm">No friends available to invite.</p>}
            {friends.length > 0 && visibleUsers.length === 0 && (
              <p className="text-muted-foreground text-sm">No results for &ldquo;{search}&rdquo;.</p>
            )}
            {visibleUsers.length > 0 && (
              <ul className="flex flex-col gap-2">
                {visibleUsers.map((f) => (
                  <GroupInviteItem
                    key={f._id}
                    friend={f}
                    isPending={pendingSet.has(f.email)}
                    inviting={inviting === f.email}
                    onInvite={() => handleInvite(f.email)}
                  />
                ))}
              </ul>
            )}
          </>
        )}
        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  );
}
