import { useMutation, useQueryClient } from '@tanstack/react-query';
import { HabitLog } from '@/types/habit';
import { upsertLog, deleteLog } from '@/api/habit';

interface LogUpdate {
  habitId: string;
  date: string;
  value: number;
}

interface BatchSaveMutationContext {
  affectedHabits: string[];
}

export function useHabitLogsMutations() {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: ({ habitId, logId }: { habitId: string; logId: string }) => deleteLog(habitId, logId),
    onMutate: ({ habitId, logId }) => {
      // Optimistically remove from cache
      queryClient.setQueriesData({ queryKey: ['habitLogs'] }, (oldData: Record<string, HabitLog[]> | undefined) => {
        if (!oldData) return oldData;
        const newData = { ...oldData };
        if (newData[habitId]) {
          newData[habitId] = newData[habitId].filter((log) => log._id !== logId);
        }
        return newData;
      });
    },
    onError: (error) => {
      // Refetch on error to restore correct state
      queryClient.invalidateQueries({ queryKey: ['habitLogs'] });
      console.error('Failed to delete log:', error);
    },
  });

  const upsertMutation = useMutation({
    mutationFn: ({ habitId, date, value }: LogUpdate) => upsertLog(habitId, date, value),
    onMutate: ({ habitId, date, value }) => {
      // Optimistically update cache with temp log
      queryClient.setQueriesData({ queryKey: ['habitLogs'] }, (oldData: Record<string, HabitLog[]> | undefined) => {
        if (!oldData) return oldData;

        const newData = { ...oldData };
        const habitLogs = newData[habitId] || [];
        const tempLog: HabitLog = {
          _id: `temp-${habitId}-${date}-${Date.now()}`,
          habitId,
          date,
          value,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const existingIndex = habitLogs.findIndex((l) => l.date === date);
        if (existingIndex >= 0) {
          const updated = [...habitLogs];
          updated[existingIndex] = tempLog;
          newData[habitId] = updated;
        } else {
          newData[habitId] = [...habitLogs, tempLog];
        }
        return newData;
      });
    },
    onSuccess: (newLog, { habitId: logHabitId }) => {
      // Update cache with real log returned from server
      queryClient.setQueriesData({ queryKey: ['habitLogs'] }, (oldData: Record<string, HabitLog[]> | undefined) => {
        if (!oldData) return oldData;

        const newData = { ...oldData };
        const habitLogs = newData[logHabitId] || [];
        const existingIndex = habitLogs.findIndex((l) => l.date === newLog.date);
        if (existingIndex >= 0) {
          const updated = [...habitLogs];
          updated[existingIndex] = newLog;
          newData[logHabitId] = updated;
        } else {
          newData[logHabitId] = [...habitLogs, newLog];
        }
        return newData;
      });
    },
    onError: (error) => {
      // Refetch on error to restore correct state
      queryClient.invalidateQueries({ queryKey: ['habitLogs'] });
      console.error('Failed to upsert log:', error);
    },
  });

  const batchSaveMutation = useMutation({
    mutationFn: async (params: { updates: LogUpdate[]; logsToDelete: Array<{ habitId: string; logId: string }> }) => {
      // Filter out temporary IDs - only delete real server IDs
      const realLogsToDelete = params.logsToDelete.filter(({ logId }) => !logId.startsWith('temp-'));

      await Promise.all(realLogsToDelete.map(({ habitId, logId }) => deleteLog(habitId, logId)));

      await Promise.all(params.updates.map(({ habitId, date, value }) => upsertLog(habitId, date, value)));

      // Return the updates so we can use them in onSuccess
      return {
        updates: params.updates,
        deletedLogIds: realLogsToDelete.map((d) => d.logId),
      };
    },
    onMutate: (params) => {
      // Optimistically update all affected queries
      const affectedHabits = new Set<string>();

      params.logsToDelete.forEach(({ habitId }) => affectedHabits.add(habitId));
      params.updates.forEach(({ habitId }) => affectedHabits.add(habitId));

      // Remove deleted logs optimistically (both temp and real IDs)
      params.logsToDelete.forEach(({ habitId, logId }) => {
        queryClient.setQueriesData({ queryKey: ['habitLogs'] }, (oldData: Record<string, HabitLog[]> | undefined) => {
          if (!oldData) return oldData;
          const newData = { ...oldData };
          if (newData[habitId]) {
            // Remove both real IDs and temp IDs
            newData[habitId] = newData[habitId].filter((l: HabitLog) => l._id !== logId);
          }
          return newData;
        });
      });

      // Add/update new logs optimistically
      params.updates.forEach(({ habitId, date, value }) => {
        queryClient.setQueriesData({ queryKey: ['habitLogs'] }, (oldData: Record<string, HabitLog[]> | undefined) => {
          if (!oldData) return oldData;

          const newData = { ...oldData };
          const habitLogs = newData[habitId] || [];
          const existingIndex = habitLogs.findIndex((l) => l.date === date);

          const tempLog: HabitLog = {
            _id: `temp-${habitId}-${date}-${Date.now()}`,
            habitId,
            date,
            value,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          if (existingIndex >= 0) {
            const updated = [...habitLogs];
            updated[existingIndex] = tempLog;
            newData[habitId] = updated;
          } else {
            newData[habitId] = [...habitLogs, tempLog];
          }
          return newData;
        });
      });

      // Return context for potential rollback
      return { affectedHabits: Array.from(affectedHabits) };
    },
    onSuccess: (_result, _params, context?: BatchSaveMutationContext) => {
      // Ensure the data is consistent in the cache
      const affectedHabits = context?.affectedHabits || [];

      // Ensure cache is properly set without refetching
      affectedHabits.forEach((habitId: string) => {
        queryClient.setQueryData(
          ['habitLogs', [habitId], '*', '*'],
          (oldData: Record<string, HabitLog[]> | undefined) => oldData
        );
      });
    },
    onError: (error, _params, context?: BatchSaveMutationContext) => {
      // Refetch on error to restore correct state
      const affectedHabits = context?.affectedHabits || [];
      affectedHabits.forEach((habitId: string) => {
        queryClient.invalidateQueries({ queryKey: ['habitLogs', [habitId]] });
      });

      console.error('Failed to batch save logs:', error);
    },
  });

  return {
    deleteMutation,
    upsertMutation,
    batchSaveMutation,
    isSaving: upsertMutation.isPending || deleteMutation.isPending || batchSaveMutation.isPending,
  };
}
