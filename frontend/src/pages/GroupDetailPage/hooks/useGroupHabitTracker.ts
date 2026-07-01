import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchGroupHabit, logGroupHabitEntry } from '@/api/group';
import { Group } from '@/types/group';
import { useAuth } from '@/context/AuthContext';
import { getTodayDate } from '@/utils/dateHelpers';

const MEMBER_COLORS = [
  { bg: 'bg-blue-500' },
  { bg: 'bg-emerald-500' },
  { bg: 'bg-violet-500' },
  { bg: 'bg-orange-500' },
  { bg: 'bg-pink-500' },
  { bg: 'bg-cyan-500' },
];

export function useGroupHabitTracker(group: Group) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [inputValue, setInputValue] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['groupHabit', group._id],
    queryFn: () => fetchGroupHabit(group._id),
    staleTime: 30 * 1000,
  });

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

  const today = getTodayDate();
  const savedValue = data?.logs.find((l) => l.userId === user?.sub && String(l.date).startsWith(today))?.value ?? 0;
  const parsedInput = parseInt(inputValue, 10);
  const isValidInt = !isNaN(parsedInput) && parsedInput >= 0 && String(parsedInput) === inputValue.trim();
  const isDirty = isValidInt && parsedInput !== savedValue;

  const handleSave = () => {
    if (!isDirty || logMutation.isPending) return;
    logMutation.mutate(parsedInput);
  };

  const memberTotals = data
    ? group.members.map((member, i) => {
        const total = data.logs.filter((l) => l.userId === member.sub).reduce((sum, l) => sum + l.value, 0);
        return { member, total, color: MEMBER_COLORS[i % MEMBER_COLORS.length], isMe: member.sub === user?.sub };
      })
    : [];

  const grandTotal = memberTotals.reduce((sum, m) => sum + m.total, 0);

  return {
    isLoading,
    habit: data?.habit ?? null,
    inputValue,
    setInputValue,
    isDirty,
    handleSave,
    isSaving: logMutation.isPending,
    saveError: logMutation.isError,
    memberTotals,
    grandTotal,
  };
}
