import { useQuery } from '@tanstack/react-query';
import { fetchHabits } from '@/api/habit';

export function useHabitsQuery() {
  return useQuery({
    queryKey: ['habits'],
    queryFn: fetchHabits,
    staleTime: 5 * 60 * 1000, // 5 min
    gcTime: 10 * 60 * 1000, // 10 min
    retry: 3,
  });
}
