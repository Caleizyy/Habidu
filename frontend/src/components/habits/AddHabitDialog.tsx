import { Button } from '@/components/ui/Button';
import { PlusIcon } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';
import { Textarea } from '@/components/ui/Textarea';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { HabitSelect } from './HabitSelect';
import { frequencyOptions, difficultyOptions, categoryOptions } from './selectChoices.constants';
import { useState } from 'react';
import { useCreateHabitMutation } from '@/hooks/useCreateHabitMutation';
import { toast } from 'sonner';
import { toastSuccess, toastError } from '@/constants/ToastStyles.constants';
import { useQuery } from '@tanstack/react-query';
import { fetchGroups } from '@/api/group';
import { useAuth } from '@/context/AuthContext';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';

export function AddHabitDialog() {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [category, setCategory] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [targetUnit, setTargetUnit] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGroupHabit, setIsGroupHabit] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState('');

  const createHabitMutation = useCreateHabitMutation();

  const { data: groups = [] } = useQuery({
    queryKey: ['groups'],
    queryFn: fetchGroups,
    enabled: open,
  });

  const ownedGroups = groups.filter((g) => g.owner === user?.sub);

  const resetForm = () => {
    setName('');
    setFrequency('');
    setDifficulty('');
    setCategory('');
    setTargetValue('');
    setTargetUnit('');
    setNotes('');
    setSubmitted(false);
    setError(null);
    setIsGroupHabit(false);
    setSelectedGroupId('');
  };

  async function handleSubmit() {
    setSubmitted(true);
    if (!name || !frequency || !difficulty || !category || !targetValue || !targetUnit) return;
    if (isGroupHabit && !selectedGroupId) return;

    setError(null);
    try {
      await createHabitMutation.mutateAsync({
        name: name,
        frequency: frequency,
        difficulty: difficulty,
        category: category,
        targetValue: parseFloat(targetValue),
        targetUnit: targetUnit,
        notes: notes,
        ...(isGroupHabit && selectedGroupId ? { groupId: selectedGroupId } : {}),
      });
      resetForm();
      setOpen(false);
      toast.success('You habit was created successfully!', toastSuccess);
    } catch {
      setError('Something went wrong. Please try again.');
      toast.error('We were unable to create your habit. Please try again', toastError);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          resetForm();
        }
      }}
    >
      <DialogTrigger asChild onClick={() => setOpen(true)}>
        <Button className="flex h-[5vh] w-[6vw] flex-row bg-gray-200">
          <PlusIcon className="size-8 text-black" />
        </Button>
      </DialogTrigger>
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
            label={frequencyOptions[0].label}
            choices={frequencyOptions[0].choices}
            value={frequency}
            onValueChange={(value) => setFrequency(value)}
          />
          {submitted && !frequency && <p className="mt-2 ml-4 text-sm text-red-500">Frequency is required.</p>}
        </div>
        <div>
          <HabitSelect
            label={difficultyOptions[0].label}
            choices={difficultyOptions[0].choices}
            value={difficulty}
            onValueChange={(value) => setDifficulty(value)}
          />
          {submitted && !difficulty && <p className="mt-2 ml-4 text-sm text-red-500">Difficulty is required.</p>}
        </div>
        <div>
          <HabitSelect
            label={categoryOptions[0].label}
            choices={categoryOptions[0].choices}
            value={category}
            onValueChange={(value) => setCategory(value)}
          />
          {submitted && !category && <p className="mt-2 ml-4 text-sm text-red-500">Category is required.</p>}
        </div>
        <div className="mt-4">
          <FieldLabel htmlFor="target-value">Target Value</FieldLabel>
          <Input
            id="target-value"
            placeholder="e.g., 30"
            type="number"
            className="mb-2"
            value={targetValue}
            onChange={(e) => setTargetValue(e.target.value)}
          />
          {submitted && !targetValue && <p className="text-sm text-red-500">Target value is required.</p>}
        </div>
        <div className="mt-4">
          <FieldLabel htmlFor="target-unit">Unit</FieldLabel>
          <Input
            id="target-unit"
            placeholder="e.g., min, km, times"
            className="mb-2"
            value={targetUnit}
            onChange={(e) => setTargetUnit(e.target.value)}
          />
          {submitted && !targetUnit && <p className="text-sm text-red-500">Unit is required.</p>}
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
        {ownedGroups.length > 0 && (
          <div className="mt-4">
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300"
                checked={isGroupHabit}
                onChange={(e) => {
                  setIsGroupHabit(e.target.checked);
                  if (!e.target.checked) setSelectedGroupId('');
                }}
              />
              Create as group habit
            </label>
            {isGroupHabit && (
              <div className="mt-2">
                <Select value={selectedGroupId} onValueChange={setSelectedGroupId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {ownedGroups.map((group) => (
                        <SelectItem key={group._id} value={group._id}>
                          {group.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {submitted && isGroupHabit && !selectedGroupId && (
                  <p className="mt-1 text-sm text-red-500">Please select a group.</p>
                )}
              </div>
            )}
          </div>
        )}
        <DialogFooter>
          <div className="flex w-full justify-center">
            {error && <p className="text-sm text-red-500">{error}</p>}
            {!error && (
              <Button
                className="h-10 w-30 bg-gray-200 text-black"
                onClick={handleSubmit}
                disabled={createHabitMutation.isPending}
              >
                {createHabitMutation.isPending ? 'Adding...' : 'Add Habit'}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
