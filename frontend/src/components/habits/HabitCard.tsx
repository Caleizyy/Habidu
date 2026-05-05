import { Card } from '@/components/ui/card';
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
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { habitSelectOptions } from '@/constants/selectChoices';

interface HabitCardProps {
  label: string;
  choices: string[];
}

export default function HabitCard({ label, choices }: HabitCardProps) {
  const habitSelectChoices = habitSelectOptions.map((option) => (
    <Select key={option.label}>
      <SelectTrigger className="w-50">
        <SelectValue placeholder={option.label} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {option.choices.map((choice) => (
            <SelectItem key={choice} value={choice}>
              {' '}
              {choice}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  ));
  return (
    <Card className="w-93 h-130">
      <div className="flex flex-row items-center justify-between">
        {/* Selection for later filtering for cards */}
        <div className="flex ml-4">
          <Select key={label}>
            <SelectTrigger className="w-50">
              <SelectValue placeholder={label} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {choices.map((choice) => (
                  <SelectItem key={choice} value={choice}>
                    {' '}
                    {choice}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Dialog>
          <DialogTrigger className="flex justify-end flex-row">
            {/* Button on the card that opens the modal */}
            <Button className="w-10 h-10 mr-4 bg-gray-100">
              <PlusIcon className="text-black size-6" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-black-200">Add a Habit</DialogTitle>
            </DialogHeader>
            <Input placeholder="Enter habit name" className="mb-8" />
            {habitSelectChoices}
            <Field className="mt-8">
              <FieldLabel htmlFor="textarea-message">Notes</FieldLabel>
              <FieldDescription>Enter notes for your habit below.</FieldDescription>
              <Textarea id="textarea-message" placeholder="Type your notes here." />
            </Field>
            <DialogFooter>
              <DialogClose asChild>
                <div className="flex justify-center w-full">
                  <Button className="w-30 h-10 bg-gray-200 text-black">Submit</Button>
                </div>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
}
