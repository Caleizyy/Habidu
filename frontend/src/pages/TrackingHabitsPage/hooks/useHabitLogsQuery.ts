import { useQuery } from '@tanstack/react-query';
import { fetchLogsForHabit } from '@/api/habit';

interface UseHabitLogsQueryParams {
  habitId: string;
  startDate: string;
  endDate: string;
  enabled?: boolean;
}

export function useHabitLogsQuery({ habitId, startDate, endDate, enabled = true }: UseHabitLogsQueryParams) {
  return useQuery({
    queryKey: ['habitLogs', habitId, startDate, endDate],
    queryFn: () => fetchLogsForHabit(habitId, startDate, endDate),
    staleTime: 5 * 60 * 1000, // 5 min
    gcTime: 10 * 60 * 1000, // 10 min
    retry: 3,
    enabled,
  });
}
