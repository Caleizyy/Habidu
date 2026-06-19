import { useState } from 'react';
import { UserPlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { fetchInviteableFriends, inviteMember } from '@/api/group';
import { Group } from '@/types/group';
import { Friend } from '@/types/index';
import { GroupInviteItem } from './GroupInviteItem';
import { errorMessage } from '@/utils/errorMessage';

interface Props {
  group: Group;
}

export function GroupInviteDialog({ group }: Props) {
  const [open, setOpen] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [inviting, setInviting] = useState<string | null>(null);
  const [inviteError, setInviteError] = useState('');
  const [search, setSearch] = useState('');

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      setSearch('');
      setInviteError('');
      setFriends([]);
      setFetchError('');
    }
    if (nextOpen) {
      setLoading(true);
      fetchInviteableFriends(group._id)
        .then(setFriends)
        .catch((err) => setFetchError(errorMessage(err, 'Failed to load friends.')))
        .finally(() => setLoading(false));
    }
  }

  async function handleInvite(email: string) {
    setInviting(email);
    setInviteError('');
    try {
      await inviteMember(group._id, email);
      setFriends((prev) => prev.filter((f) => f.email !== email));
    } catch (err) {
      setInviteError(errorMessage(err, 'Failed to send invite.'));
    } finally {
      setInviting(null);
    }
  }

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
        <Input placeholder="Search by name or email" value={search} onChange={(e) => setSearch(e.target.value)} />
        {loading && <p>Loading...</p>}
        {fetchError && <p className="text-destructive text-sm">{fetchError}</p>}
        {!loading && !fetchError && (
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
                    inviting={inviting === f.email}
                    onInvite={() => handleInvite(f.email)}
                  />
                ))}
              </ul>
            )}
          </>
        )}
        {inviteError && <p className="text-destructive text-sm">{inviteError}</p>}
        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  );
}
