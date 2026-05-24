import { Button } from '@/components/ui/Button';
import { PlusIcon } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';
import { Textarea } from '@/components/ui/Textarea';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { HabitSelect } from './HabitSelect';
import { habitSelectOptions } from './selectChoices.constants';
import { createHabit } from '@/services/habitService';
import { useState } from 'react';

export function AddHabitDialog({ onHabitCreated }: { onHabitCreated: () => void }) {
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [category, setCategory] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [open, setOpen] = useState(false);

  async function handleSubmit() {
    setSubmitted(true);
    if (!name || !frequency || !difficulty || !category) return;

    setIsLoading(true);
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
    setIsLoading(false);
    setOpen(false);
    setSubmitted(false);
    onHabitCreated();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          setName('');
          setFrequency('');
          setDifficulty('');
          setCategory('');
          setNotes('');
          setSubmitted(false);
        }
      }}
    >
      <div className="flex flex-row justify-end">
        <DialogTrigger asChild onClick={() => setOpen(true)}>
          <Button className="mr-12 flex h-[5vh] w-[6vw] flex-row bg-gray-200">
            <PlusIcon className="size-8 text-black" />
          </Button>
        </DialogTrigger>
      </div>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-black-200">Add a Habit</DialogTitle>
        </DialogHeader>
        <div className="mb-8">
          <Input
            placeholder="Enter habit name"
            className="mb-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {submitted && !name && <p className="text-sm text-red-500">Habit name is required.</p>}
        </div>
        <div>
          <HabitSelect
            label={habitSelectOptions[0].label}
            choices={habitSelectOptions[0].choices}
            value={frequency}
            onValueChange={(value) => setFrequency(value)}
          />
          {submitted && !frequency && <p className="mt-2 ml-4 text-sm text-red-500">Frequency is required.</p>}
        </div>
        <div>
          <HabitSelect
            label={habitSelectOptions[1].label}
            choices={habitSelectOptions[1].choices}
            value={category}
            onValueChange={(value) => setCategory(value)}
          />
          {submitted && !category && <p className="mt-2 ml-4 text-sm text-red-500">Category is required.</p>}
        </div>
        <div>
          <HabitSelect
            label={habitSelectOptions[2].label}
            choices={habitSelectOptions[2].choices}
            value={difficulty}
            onValueChange={(value) => setDifficulty(value)}
          />
          {submitted && !difficulty && <p className="mt-2 ml-4 text-sm text-red-500">Difficulty is required.</p>}
        </div>
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
          <div className="flex w-full justify-center">
            <Button className="h-10 w-30 bg-gray-200 text-black" onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Habit'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
