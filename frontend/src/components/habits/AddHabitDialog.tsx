import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { HabitSelect } from './HabitSelect';
import { habitSelectOptions } from './selectChoices.constants';

export function AddHabitDialog() {
  return (
    <Dialog>
      <DialogTrigger className="flex flex-row justify-end">
        {/* Button on the card that opens the modal */}
        <Button className="mr-4 h-10 w-10 bg-gray-100">
          <PlusIcon className="size-6 text-black" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-black-200">Add a Habit</DialogTitle>
        </DialogHeader>
        <Input placeholder="Enter habit name" className="mb-8" />
        {habitSelectOptions.map((option) => (
          <HabitSelect key={option.label} label={option.label} choices={option.choices} />
        ))}
        <Field className="mt-8">
          <FieldLabel htmlFor="textarea-message">Notes</FieldLabel>
          <FieldDescription>Enter notes for your habit below.</FieldDescription>
          <Textarea id="textarea-message" placeholder="Type your notes here." />
        </Field>
        <DialogFooter>
          <DialogClose asChild>
            <div className="flex w-full justify-center">
              <Button className="h-10 w-30 bg-gray-200 text-black">Submit</Button>
            </div>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
