import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { GroupInviteDialog } from '@/components/groups/GroupInviteDialog';
import { fetchGroup } from '@/api/group';
import { Group } from '@/types/group';
import { useAuth } from '@/context/AuthContext';
import { initials } from '@/utils/initials';

export function GroupDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchGroup(id)
      .then(setGroup)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const isOwner = user?.sub === group?.owner;

  return (
    <PageLayout
      title={group?.name ?? 'Group'}
      back="/groups"
      actions={isOwner && group ? <GroupInviteDialog group={group} /> : undefined}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-4">
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && group && (
          <>
            <h2 className="text-sm font-semibold tracking-wide text-neutral-500 uppercase">Members</h2>
            <ul className="flex flex-col gap-3">
              {group.members.map((member) => {
                const name = `${member.firstName} ${member.lastName}`;
                return (
                  <li key={member.sub} className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={member.avatar} alt={name} />
                      <AvatarFallback>{initials(name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">
                        {name}
                        {member.sub === group.owner && (
                          <span className="text-muted-foreground ml-1.5 text-xs">(owner)</span>
                        )}
                      </p>
                      <p className="text-muted-foreground text-xs">{member.email}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
    </PageLayout>
  );
}
