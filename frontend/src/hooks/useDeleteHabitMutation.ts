import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteHabit } from '@/api/habit';

export function useDeleteHabitMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteHabit(id),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      return true;
    },
    onError: (error) => {
      console.log('onError fired', error);
    },
  });
}
