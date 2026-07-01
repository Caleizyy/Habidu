import { useState, useEffect } from 'react';
import { useParams, Link, generatePath } from 'react-router-dom';
import { ROUTES } from '@/constants/Routes.constants';
import { PageLayout } from '@/components/layout/PageLayout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { GroupInviteDialog } from '@/components/groups/GroupInviteDialog';
import { fetchGroup } from '@/api/group';
import { Group } from '@/types/group';
import { useAuth } from '@/context/AuthContext';
import { initials } from '@/utils/initials';
import { errorMessage } from '@/utils/errorMessage';
import { GroupLeaveDialog } from '@/components/groups/GroupLeaveDialog';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants';

export function GroupDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchGroup(id)
      .then(setGroup)
      .catch((err) => setError(errorMessage(err, 'Failed to load group.')))
      .finally(() => setLoading(false));
  }, [id]);

  const isOwner = user?.sub === group?.owner;

  return (
    <PageLayout
      title={group?.name ?? 'Group'}
      back="/groups"
      backLabel="Back to groups"
      actions={
        group ? (
          isOwner ? (
            <GroupInviteDialog group={group} />
          ) : (
            <GroupLeaveDialog group={group} onLeft={() => navigate(ROUTES.GROUPS)} />
          )
        ) : undefined
      }
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
                    <Link to={generatePath(ROUTES.PROFILE, { userId: member._id })}>
                      <Avatar className="cursor-pointer transition-opacity hover:opacity-80">
                        <AvatarImage src={member.avatar} alt={name} />
                        <AvatarFallback>{initials(name)}</AvatarFallback>
                      </Avatar>
                    </Link>
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
