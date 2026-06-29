import { Button } from '@/components/ui/Button';
import { TrashIcon, X } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';
import { useState } from 'react';
import { useDeleteHabitMutation } from '@/hooks/useDeleteHabitMutation';

interface DeleteHabitDialogProps {
  id: string;
}

export function DeleteHabitDialog({ id }: Readonly<DeleteHabitDialogProps>) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteHabitMutation = useDeleteHabitMutation();

  async function handleSubmit() {
    setError(null);
    try {
      await deleteHabitMutation.mutateAsync(id);
      setOpen(false);
    } catch (e) {
      console.log('caught', e);
      setError('Something went wrong. Please try again.');
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
      }}
    >
      <DialogTrigger asChild onClick={() => setOpen(true)}>
        <Button className="flex h-[5vh] w-[6vw] flex-row bg-white">
          <TrashIcon className="size-8 bg-white text-black" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-black-200">Delete a Habit</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <div className="flex w-full justify-center">
            {error && <p className="text-sm text-red-500">{error}</p>}
            {!error && (
              <Button
                className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-red-200 px-4 py-2 text-black transition-all duration-200 hover:-translate-y-1 hover:bg-red-400 hover:shadow-lg disabled:pointer-events-none disabled:bg-red-300 disabled:opacity-50"
                onClick={handleSubmit}
                disabled={deleteHabitMutation.isPending}
              >
                <X className="size-5" />
                <span className="text-lg font-medium">
                  {deleteHabitMutation.isPending ? 'Deleting...' : 'Confirm delete'}
                </span>
              </Button>
            )}
          </div>
          <div className="flex w-full justify-center">
            {!error && (
              <Button className="h-10 w-30 bg-gray-200 text-black" onClick={() => setOpen(!open)}>
                Cancel
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
