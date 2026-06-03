import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createHabit } from '@/api/habit';
import { Habit } from '@/types/habit';

interface CreateHabitInput {
  name: string;
  frequency: string;
  difficulty: string;
  category: string;
  targetValue: number;
  targetUnit: string;
  notes?: string;
}

export function useCreateHabitMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (habit: CreateHabitInput) => createHabit(habit),
    onSuccess: (newHabit: Habit) => {
      // Invalidate habits query to refetch
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      return newHabit;
    },
  });
}
