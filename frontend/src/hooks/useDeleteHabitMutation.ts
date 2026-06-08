import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteHabit } from '@/api/habit';

export function useDeleteHabitMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteHabit(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
  });
}
