import { useState } from 'react';
import { LogOutIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog';
import { toast } from 'sonner';
import { toastSuccess, toastError } from '@/constants/ToastStyles.constants';
import { X } from 'lucide-react';
import { groupRequestsApi } from '@/api/groupRequests';
import { Group } from '@/types/group';

export function GroupLeaveDialog({ group, onLeft }: { group: Group; onLeft: () => void }) {
  const [open, setOpen] = useState(false);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
  }

  async function handleSubmit() {
    try {
      await groupRequestsApi.leaveGroup(group._id);
      setOpen(false);
      onLeft();
      toast.success('You left the group successfully!', toastSuccess);
    } catch {
      toast.error('You were unable to leave the group. Please try again', toastError);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-red-400 transition-all duration-200 hover:-translate-y-1 hover:bg-red-600 hover:shadow-lg">
          <LogOutIcon />
          Leave
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want the leave the group?</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <div className="flex w-full justify-center">
            <Button
              className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-red-200 px-4 py-2 text-black transition-all duration-200 hover:-translate-y-1 hover:bg-red-400 hover:shadow-lg disabled:pointer-events-none disabled:bg-red-300 disabled:opacity-50"
              onClick={handleSubmit}
            >
              <LogOutIcon className="size-5" />
              <span className="font-medium">Leave Group</span>
            </Button>
          </div>
          <div className="flex w-full justify-center">
            <Button
              className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-gray-200 px-4 py-2 text-black transition-all duration-200 hover:-translate-y-1 hover:bg-gray-300 hover:shadow-lg disabled:pointer-events-none disabled:bg-red-300 disabled:opacity-50"
              onClick={() => setOpen(!open)}
            >
              <X className="size-5" />
              Cancel
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
