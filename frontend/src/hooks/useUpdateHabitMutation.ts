import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateHabit } from '@/api/habit';
import { Habit } from '@/types/habit';

interface UpdateHabitInput {
  id: string;
  name?: string;
  frequency?: string;
  difficulty?: string;
  category?: string;
  targetValue?: number;
  targetUnit?: string;
  notes?: string;
}

export function useUpdateHabitMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (habit: UpdateHabitInput) => updateHabit(habit),
    onSuccess: async (updatedHabit: Habit) => {
      await queryClient.invalidateQueries({ queryKey: ['habits'] });
      return updatedHabit;
    },
    onError: (error) => {
      console.log('onError fired', error);
    },
  });
}
