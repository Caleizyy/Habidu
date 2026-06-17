import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { GroupCreateDialog } from '@/components/groups/GroupCreateDialog';
import { fetchGroups } from '@/api/group';
import { Group } from '@/types/group';

export function GroupsPage() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGroups()
      .then(setGroups)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageLayout title="Groups" actions={<GroupCreateDialog onCreated={(group) => navigate(`/groups/${group._id}`)} />}>
      <div className="flex min-h-0 flex-1 flex-col gap-4">
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && groups.length === 0 && (
          <p className="text-muted-foreground text-sm">You have not joined any groups yet.</p>
        )}
        {!loading && !error && groups.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => (
              <button key={group._id} className="text-left" onClick={() => navigate(`/groups/${group._id}`)}>
                <Card className="hover:ring-primary/40 cursor-pointer transition-shadow">
                  <CardHeader>
                    <CardTitle>{group.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">
                      {group.members.length} {group.members.length === 1 ? 'member' : 'members'}
                    </p>
                  </CardContent>
                </Card>
              </button>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
