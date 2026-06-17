import { useState } from 'react';
import { PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { createGroup } from '@/api/group';
import { Group } from '@/types/group';

interface Props {
  onCreated: (group: Group) => void;
}

export function GroupCreateDialog({ onCreated }: Props) {
  const [open, setOpen] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [nameError, setNameError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      setGroupName('');
      setNameError('');
    }
  }

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
      handleOpenChange(false);
      onCreated(group);
    } catch (err) {
      setNameError(err instanceof Error ? err.message : 'Failed to create group.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
  );
}
