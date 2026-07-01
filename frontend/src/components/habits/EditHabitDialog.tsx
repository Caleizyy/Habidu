import { Button } from '@/components/ui/Button';
import { EditIcon } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';
import { Textarea } from '@/components/ui/Textarea';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { HabitSelect } from './HabitSelect';
import { frequencyOptions, difficultyOptions, categoryOptions } from './selectChoices.constants';
import { useState } from 'react';
import { useUpdateHabitMutation } from '@/hooks/useUpdateHabitMutation';
import { Habit } from '@/types/habit';
import { toast } from 'sonner';
import { toastSuccess, toastError } from '@/constants/ToastStyles.constants';
import { useQuery } from '@tanstack/react-query';
import { fetchGroups } from '@/api/group';
import { useAuth } from '@/context/AuthContext';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';

interface EditHabitDialogProps {
  habit: Habit;
}

export function EditHabitDialog({ habit }: Readonly<EditHabitDialogProps>) {
  const { user } = useAuth();
  const [name, setName] = useState<string>(habit.name);
  const [frequency, setFrequency] = useState<string>(habit.frequency);
  const [difficulty, setDifficulty] = useState<string>(habit.difficulty);
  const [category, setCategory] = useState<string>(habit.category);
  const [targetValue, setTargetValue] = useState<number>(habit.targetValue);
  const [targetUnit, setTargetUnit] = useState<string>(habit.targetUnit);
  const [notes, setNotes] = useState<string>(habit.notes ?? '');
  const [selectedGroupId, setSelectedGroupId] = useState<string>(habit.groupId ?? '');
  const [submitted, setSubmitted] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateHabitMutation = useUpdateHabitMutation();

  const { data: groups = [] } = useQuery({
    queryKey: ['groups'],
    queryFn: fetchGroups,
    enabled: open,
  });

  const ownedGroups = groups.filter((g) => g.owner === user?.sub);

  const resetForm = () => {
    setName(habit.name);
    setFrequency(habit.frequency);
    setDifficulty(habit.difficulty);
    setCategory(habit.category);
    setTargetValue(habit.targetValue);
    setTargetUnit(habit.targetUnit);
    setNotes(habit.notes ?? '');
    setSelectedGroupId(habit.groupId ?? '');
    setSubmitted(false);
    setError(null);
  };

  async function handleSubmit() {
    setSubmitted(true);
    if (!name || !frequency || !difficulty || !category || !targetValue || !targetUnit) return;

    setError(null);
    try {
      await updateHabitMutation.mutateAsync({
        id: habit._id,
        name: name,
        frequency: frequency,
        difficulty: difficulty,
        category: category,
        targetValue: targetValue,
        targetUnit: targetUnit,
        notes: notes,
        groupId: selectedGroupId || null,
      });
      resetForm();
      setOpen(false);
      toast.success('You habit was edited successfully!', toastSuccess);
    } catch {
      setError('Something went wrong. Please try again.');
      toast.error('We were unable to edit your habit. Please try again', toastError);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        resetForm();
      }}
    >
      <DialogTrigger asChild onClick={() => setOpen(true)}>
        <Button className="flex h-auto flex-row bg-white transition-all duration-200 hover:-translate-y-1">
          <EditIcon className="size-8 bg-white text-black" />
          <span className="ml-2 font-medium text-black">Edit</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-black-200">Edit a Habit</DialogTitle>
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
            choices={selectedGroupId ? ['Weekly'] : frequencyOptions[0].choices}
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
            onChange={(e) => setTargetValue(parseFloat(e.target.value) || 0)}
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
            <FieldLabel>Group</FieldLabel>
            <Select
              value={selectedGroupId}
              onValueChange={(val) => {
                const newGroupId = val === 'none' ? '' : val;
                setSelectedGroupId(newGroupId);
                if (newGroupId) setFrequency('Weekly');
              }}
            >
              <SelectTrigger className="mt-1 w-full">
                <SelectValue placeholder="None (personal habit)" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="none">None (personal habit)</SelectItem>
                  {ownedGroups.map((group) => (
                    <SelectItem key={group._id} value={group._id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}
        <DialogFooter>
          <div className="flex w-full justify-center">
            {error && <p className="text-sm text-red-500">{error}</p>}
            {!error && (
              <Button
                className="h-10 w-30 bg-gray-200 text-black transition-all duration-200 hover:-translate-y-1 hover:bg-gray-300"
                onClick={handleSubmit}
                disabled={updateHabitMutation.isPending}
              >
                {updateHabitMutation.isPending ? 'Editing...' : 'Edit Habit'}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
