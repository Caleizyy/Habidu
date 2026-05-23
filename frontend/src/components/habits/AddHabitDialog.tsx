import { Button } from '@/components/ui/Button';
import { PlusIcon } from 'lucide-react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/Dialog';
import { Textarea } from '@/components/ui/Textarea';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { HabitSelect } from './HabitSelect';
import { habitSelectOptions } from './selectChoices.constants';
import { createHabit } from '@/services/habitService';
import { useState } from 'react';

export function AddHabitDialog() {
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [category, setCategory] = useState('');
  const [notes, setNotes] = useState('');

  async function handleSubmit() {
    if (!name || !frequency || !difficulty || !category) return;

    await createHabit({
      name: name,
      frequency: frequency,
      difficulty: difficulty,
      category: category,
      notes: notes,
    });
    setName('');
    setFrequency('');
    setDifficulty('');
    setCategory('');
    setNotes('');
  }

  return (
    <Dialog
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setName('');
          setFrequency('');
          setDifficulty('');
          setCategory('');
          setNotes('');
        }
      }}
    >
      <DialogTrigger className="flex flex-row justify-end">
        {/* Button on the card that opens the modal */}
        <Button className="mr-12 flex h-[5vh] w-[6vw] flex-row bg-gray-200">
          <PlusIcon className="size-8 text-black" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-black-200">Add a Habit</DialogTitle>
        </DialogHeader>
        <Input placeholder="Enter habit name" className="mb-8" value={name} onChange={(e) => setName(e.target.value)} />
        <HabitSelect
          label={habitSelectOptions[0].label}
          choices={habitSelectOptions[0].choices}
          value={frequency}
          onValueChange={(value) => setFrequency(value)}
        />
        <HabitSelect
          label={habitSelectOptions[1].label}
          choices={habitSelectOptions[1].choices}
          value={category}
          onValueChange={(value) => setCategory(value)}
        />
        <HabitSelect
          label={habitSelectOptions[2].label}
          choices={habitSelectOptions[2].choices}
          value={difficulty}
          onValueChange={(value) => setDifficulty(value)}
        />
        <Field className="mt-8">
          <FieldLabel htmlFor="textarea-message">Notes</FieldLabel>
          <FieldDescription>Enter notes for your habit below.</FieldDescription>
          <Textarea
            id="textarea-message"
            placeholder="Type your notes here."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </Field>
        <DialogFooter>
          <DialogClose asChild>
            <div className="flex w-full justify-center">
              <Button className="h-10 w-30 bg-gray-200 text-black" onClick={handleSubmit}>
                Submit
              </Button>
            </div>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
