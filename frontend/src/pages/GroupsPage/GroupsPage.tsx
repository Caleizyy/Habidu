import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { fetchGroups, createGroup } from '@/api/group';
import { Group } from '@/types/group';

export function GroupsPage() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [nameError, setNameError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchGroups()
      .then(setGroups)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setGroupName(e.target.value);
    if (nameError) setNameError('');
  }

  async function handleCreate() {
    if (!groupName.trim()) {
      setNameError('Group name is required.');
      return;
    }
    setSubmitting(true);
    try {
      const group = await createGroup(groupName.trim());
      setDialogOpen(false);
      setGroupName('');
      navigate(`/groups/${group._id}`);
    } catch (err) {
      setNameError(err instanceof Error ? err.message : 'Failed to create group.');
    } finally {
      setSubmitting(false);
    }
  }

  function handleDialogOpenChange(open: boolean) {
    setDialogOpen(open);
    if (!open) {
      setGroupName('');
      setNameError('');
    }
  }

  return (
    <PageLayout
      title="Groups"
      actions={
        <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon />
              Create group
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create group</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="group-name">Group name</Label>
              <Input
                id="group-name"
                placeholder="My awesome group"
                maxLength={60}
                value={groupName}
                onChange={handleNameChange}
                aria-invalid={!!nameError}
              />
              {nameError && <p className="text-destructive text-sm">{nameError}</p>}
            </div>
            <DialogFooter>
              <Button onClick={handleCreate} disabled={submitting}>
                {submitting ? 'Creating…' : 'Create'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col gap-4">
        {isLoading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!isLoading && !error && groups.length === 0 && (
          <p className="text-muted-foreground text-sm">You have not joined any groups yet.</p>
        )}
        {!isLoading && !error && groups.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => (
              <button key={group._id} className="text-left" onClick={() => navigate(`/groups/${group._id}`)}>
                <Card className="hover:ring-primary/40 cursor-pointer transition-shadow">
                  <CardHeader>
                    <CardTitle>{group.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">
                      {group.members.length} member{group.members.length !== 1 ? 's' : ''}
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
