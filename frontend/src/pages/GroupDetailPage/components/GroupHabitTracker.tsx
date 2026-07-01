import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchGroupHabit, logGroupHabitEntry } from '@/api/group';
import { Group } from '@/types/group';
import { useAuth } from '@/context/AuthContext';
import { getTodayDate } from '@/utils/dateHelpers';
import { HabitHeader } from './HabitHeader';
import { StackedProgressBar } from './StackedProgressBar';
import { MemberRow } from './MemberRow';

const MEMBER_COLORS = [
  { bg: 'bg-blue-500' },
  { bg: 'bg-emerald-500' },
  { bg: 'bg-violet-500' },
  { bg: 'bg-orange-500' },
  { bg: 'bg-pink-500' },
  { bg: 'bg-cyan-500' },
];

interface Props {
  group: Group;
}

export function GroupHabitTracker({ group }: Props) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [inputValue, setInputValue] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['groupHabit', group._id],
    queryFn: () => fetchGroupHabit(group._id),
    staleTime: 30 * 1000,
  });

  // Pre-fill input with today's existing log whenever data loads/refreshes
  useEffect(() => {
    if (!data || !user) return;
    const today = getTodayDate();
    const myLog = data.logs.find((l) => l.userId === user.sub && String(l.date).startsWith(today));
    setInputValue(String(myLog?.value ?? 0));
  }, [data, user]);

  const logMutation = useMutation({
    mutationFn: (value: number) => logGroupHabitEntry(group._id, getTodayDate(), value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groupHabit', group._id] });
    },
  });

  if (isLoading) {
    return <p className="text-sm text-neutral-500">Loading group goal...</p>;
  }

  if (!data) {
    return (
      <p className="text-sm text-neutral-500 italic">
        No group goal set yet. The owner can create a habit and assign it to this group from the Habits page.
      </p>
    );
  }

  const { habit, logs } = data;
  const today = getTodayDate();
  const myTodayLog = logs.find((l) => l.userId === user?.sub && String(l.date).startsWith(today));
  const savedValue = myTodayLog?.value ?? 0;
  const parsedInput = parseInt(inputValue, 10);
  const isValidInt = !isNaN(parsedInput) && parsedInput >= 0 && String(parsedInput) === inputValue.trim();
  const isDirty = isValidInt && parsedInput !== savedValue;

  const handleSave = () => {
    if (!isDirty || logMutation.isPending) return;
    logMutation.mutate(parsedInput);
  };

  const memberTotals = group.members.map((member, i) => {
    const memberLogs = logs.filter((l) => l.userId === member.sub);
    const total = memberLogs.reduce((sum, l) => sum + l.value, 0);
    return { member, total, color: MEMBER_COLORS[i % MEMBER_COLORS.length] };
  });

  const grandTotal = memberTotals.reduce((sum, m) => sum + m.total, 0);

  return (
    <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-700">
      <HabitHeader
        name={habit.name}
        frequency={habit.frequency}
        targetValue={habit.targetValue}
        targetUnit={habit.targetUnit}
        grandTotal={grandTotal}
      />

      <StackedProgressBar memberTotals={memberTotals} targetValue={habit.targetValue} targetUnit={habit.targetUnit} />

      <div className="flex flex-col gap-3">
        {memberTotals.map(({ member, total, color }) => (
          <MemberRow
            key={member.sub}
            member={member}
            total={total}
            color={color}
            targetUnit={habit.targetUnit}
            editProps={
              member.sub === user?.sub
                ? {
                    inputValue,
                    onInputChange: setInputValue,
                    onSave: handleSave,
                    isSaving: logMutation.isPending,
                    isDirty,
                  }
                : undefined
            }
          />
        ))}
      </div>

      {logMutation.isError && <p className="mt-2 text-xs text-red-500">Failed to save. Please try again.</p>}
    </div>
  );
}
