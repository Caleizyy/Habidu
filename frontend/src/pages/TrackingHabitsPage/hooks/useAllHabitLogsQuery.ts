import { useQuery } from '@tanstack/react-query';
import { HabitLog } from '@/types/habit';
import { fetchLogsForHabit } from '@/api/habit';

interface UseAllHabitLogsQueryParams {
  habitIds: string[];
  startDate: string;
  endDate: string;
  enabled?: boolean;
}

export function useAllHabitLogsQuery({ habitIds, startDate, endDate, enabled = true }: UseAllHabitLogsQueryParams) {
  return useQuery({
    queryKey: ['habitLogs', habitIds, startDate, endDate],
    queryFn: async () => {
      if (habitIds.length === 0) return {};

      const logsData: Record<string, HabitLog[]> = {};

      // Fetch all habit logs in parallel
      const results = await Promise.all(
        habitIds.map(async (habitId) => {
          try {
            const logs = await fetchLogsForHabit(habitId, startDate, endDate);
            return { habitId, logs };
          } catch (err) {
            console.error(`Failed to fetch logs for habit ${habitId}:`, err);
            return { habitId, logs: [] };
          }
        })
      );

      // Aggregate results
      results.forEach(({ habitId, logs }) => {
        logsData[habitId] = logs;
      });

      return logsData;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    enabled: enabled && habitIds.length > 0,
  });
}
