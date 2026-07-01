import { Button } from '@/components/ui/Button';
import { Check, TrashIcon, X } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';
import { useState } from 'react';
import { useDeleteHabitMutation } from '@/hooks/useDeleteHabitMutation';
import { toast } from 'sonner';
import { toastSuccess, toastError } from '@/constants/ToastStyles.constants';

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
      toast.success('You habit was deleted successfully!', toastSuccess);
    } catch (e) {
      console.log('caught', e);
      setError('Something went wrong. Please try again.');
      toast.error('We were unable to delete your habit. Please try again', toastError);
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
        <Button className="flex h-auto flex-row bg-white transition-all duration-200 hover:-translate-y-1">
          <TrashIcon className="size-8 bg-white text-black" />
          <span className="ml-2 font-medium text-black">Delete</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-black-200 flex justify-center">Delete a Habit?</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <div className="flex w-full justify-center">
            {error && <p className="text-sm text-red-500">{error}</p>}
            {!error && (
              <Button
                className="flex h-10 w-40 cursor-pointer items-center justify-center gap-2 rounded-lg bg-red-200 px-4 py-2 text-black transition-all duration-200 hover:-translate-y-1 hover:bg-red-400 hover:shadow-lg disabled:pointer-events-none disabled:bg-red-300 disabled:opacity-50"
                onClick={handleSubmit}
                disabled={deleteHabitMutation.isPending}
              >
                <Check className="size-5" />
                <span className="font-medium">{deleteHabitMutation.isPending ? 'Deleting...' : 'Confirm delete'}</span>
              </Button>
            )}
          </div>
          <div className="flex w-full justify-center">
            {!error && (
              <Button
                className="h-10 w-40 bg-gray-200 text-black transition-all duration-200 hover:-translate-y-1 hover:bg-gray-400 hover:shadow-lg"
                onClick={() => setOpen(!open)}
              >
                <X className="size-5" />
                Cancel
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
