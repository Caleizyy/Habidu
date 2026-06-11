import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { UserPlusIcon } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/Button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog';
import { fetchGroup, inviteMember } from '@/api/group';
import { friendsApi } from '@/api/friends';
import { Group } from '@/types/group';
import { User } from '@/types/index';
import { useAuth } from '@/context/AuthContext';

function initials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function GroupDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [group, setGroup] = useState<Group | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [inviteOpen, setInviteOpen] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [inviting, setInviting] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchGroup(id)
      .then(setGroup)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [id]);

  async function handleOpenInvite(open: boolean) {
    setInviteOpen(open);
    if (open && allUsers.length === 0) {
      setUsersLoading(true);
      friendsApi
        .getFriends()
        .then(setAllUsers)
        .catch(console.error)
        .finally(() => setUsersLoading(false));
    }
  }

  async function handleInvite(sub: string) {
    if (!id) return;
    setInviting(sub);
    try {
      const updated = await inviteMember(id, sub);
      setGroup(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setInviting(null);
    }
  }

  const isOwner = user?.sub === group?.owner;
  const memberSubs = new Set(group?.members.map((m) => m.sub) ?? []);
  const invitableUsers = allUsers.filter((u) => !memberSubs.has(u.sub));

  return (
    <PageLayout
      title={group?.name ?? 'Group'}
      actions={
        isOwner && group ? (
          <Dialog open={inviteOpen} onOpenChange={handleOpenInvite}>
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
              {usersLoading && <p>Loading...</p>}
              {!usersLoading && invitableUsers.length === 0 && (
                <p className="text-muted-foreground text-sm">No users available to invite.</p>
              )}
              {!usersLoading && invitableUsers.length > 0 && (
                <ul className="flex flex-col gap-2">
                  {invitableUsers.map((u) => (
                    <li key={u.sub} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Avatar size="sm">
                          <AvatarImage src={u.avatar} alt={u.name} />
                          <AvatarFallback>{initials(u.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{u.name}</p>
                          <p className="text-muted-foreground text-xs">{u.email}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={inviting === u.sub}
                        onClick={() => handleInvite(u.sub)}
                      >
                        {inviting === u.sub ? 'Adding…' : 'Add'}
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
              <DialogFooter showCloseButton />
            </DialogContent>
          </Dialog>
        ) : undefined
      }
    >
      <div className="flex min-h-0 flex-1 flex-col gap-4">
        {isLoading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!isLoading && !error && group && (
          <>
            <h2 className="text-sm font-semibold tracking-wide text-neutral-500 uppercase">Members</h2>
            <ul className="flex flex-col gap-3">
              {group.members.map((member) => (
                <li key={member.sub} className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{initials(member.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">
                      {member.name}
                      {member.sub === group.owner && (
                        <span className="text-muted-foreground ml-1.5 text-xs">(owner)</span>
                      )}
                    </p>
                    <p className="text-muted-foreground text-xs">{member.email}</p>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </PageLayout>
  );
}
