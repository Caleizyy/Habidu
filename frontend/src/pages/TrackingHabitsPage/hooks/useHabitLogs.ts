import * as React from 'react';
import { monthKey, getTodayDate } from '@/utils/dateHelpers';
import { calculateStreaks } from '@/utils/streakHelpers';
import { HABIT_TRACKING_CONSTANTS } from '@/constants/HabitTracking.constants';
import { useHabitsQuery } from './useHabitsQuery';
import { useAllHabitLogsQuery } from './useAllHabitLogsQuery';
import { useHabitLogsMutations } from './useHabitLogsMutations';
import { useDraftManager } from './useDraftManager';

export function useHabitLogs(WEEKLY_ROW_LABELS: Array<{ weekKey: string; label: string; dates: string[] }>) {
  const TODAY = getTodayDate();

  // Query habits
  const habitsQuery = useHabitsQuery();

  // Calculate date range: last 1 year from today
  const dateRange = React.useMemo(() => {
    const todayDate = new Date(TODAY + 'T00:00:00');
    const oneYearAgo = new Date(todayDate);
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const startDate = `${oneYearAgo.getFullYear()}-${String(oneYearAgo.getMonth() + 1).padStart(2, '0')}-${String(oneYearAgo.getDate()).padStart(2, '0')}`;
    const endDate = TODAY;
    return { startDate, endDate };
  }, [TODAY]);

  // Query logs for each habit
  const logsQuery = useAllHabitLogsQuery({
    habitIds: habitsQuery.data?.map((h) => h._id) ?? [],
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    enabled: !!habitsQuery.data,
  });

  // Draft manager
  const draftManager = useDraftManager();

  // Mutations
  const mutations = useHabitLogsMutations();

  // Aggregate logs from all queries - memoized to avoid changing dependencies
  const logs = React.useMemo(() => logsQuery.data ?? {}, [logsQuery.data]);

  // Combined loading state
  const loading = React.useMemo(() => {
    return habitsQuery.isLoading || logsQuery.isLoading;
  }, [habitsQuery.isLoading, logsQuery.isLoading]);

  // Combined error state
  const error = React.useMemo(() => {
    if (habitsQuery.isError) {
      return 'Unable to load your habits. Please refresh the page.';
    }
    if (logsQuery.isError) {
      return 'Unable to load your logs. Please refresh the page.';
    }
    return null;
  }, [habitsQuery.isError, logsQuery.isError]);

  // Enhanced add/edit functions that also handle drafts
  const addLog = React.useCallback(
    (habitId: string, value: number, date: string = TODAY) => {
      draftManager.addLog(habitId, value, date);
    },
    [draftManager, TODAY]
  );

  const editLog = React.useCallback(
    (habitId: string, date: string, newValue: number) => {
      draftManager.editLog(habitId, date, newValue);
    },
    [draftManager]
  );

  const editWeeklyLog = React.useCallback(
    (habitId: string, dates: string[], newValue: number) => {
      const draftKey = `WEEK:${dates[0]}`;
      draftManager.editLog(habitId, draftKey, newValue);
    },
    [draftManager]
  );

  const editMonthlyLog = React.useCallback(
    (habitId: string, mKey: string, newValue: number) => {
      const draftKey = `MONTH:${mKey}`;
      draftManager.editLog(habitId, draftKey, newValue);
    },
    [draftManager]
  );

  const undoLog = React.useCallback(
    (habitId: string, date: string) => {
      const isDraft = draftManager.drafts[habitId]?.[date] !== undefined;

      if (isDraft) {
        draftManager.undoDraft(habitId, date);
      } else {
        const savedLogs = logs[habitId] ?? [];
        const logToDelete = savedLogs.find((l) => l.date === date);

        if (logToDelete) {
          draftManager.markLogForDeletion(logToDelete._id, habitId);
        }
      }
    },
    [draftManager, logs]
  );

  const undoWeeklyLog = React.useCallback(
    (habitId: string, dates: string[]) => {
      // Check if this week has a draft
      const draftKey = `WEEK:${dates[0]}`;
      const isDraft = draftManager.drafts[habitId]?.[draftKey] !== undefined;

      if (isDraft) {
        draftManager.undoDraft(habitId, draftKey);
      } else {
        // Mark all logs in this week for deletion
        const savedLogs = logs[habitId] ?? [];
        const dateSet = new Set(dates);
        savedLogs.forEach((log) => {
          if (dateSet.has(log.date)) {
            draftManager.markLogForDeletion(log._id, habitId);
          }
        });
      }
    },
    [draftManager, logs]
  );

  const undoMonthlyLog = React.useCallback(
    (habitId: string, mKey: string) => {
      // Check if this month has a draft
      const draftKey = `MONTH:${mKey}`;
      const isDraft = draftManager.drafts[habitId]?.[draftKey] !== undefined;

      if (isDraft) {
        draftManager.undoDraft(habitId, draftKey);
      } else {
        // Mark all logs in this month for deletion
        const savedLogs = logs[habitId] ?? [];
        savedLogs.forEach((log) => {
          if (monthKey(log.date) === mKey) {
            draftManager.markLogForDeletion(log._id, habitId);
          }
        });
      }
    },
    [draftManager, logs]
  );

  // Display value helpers
  function getDisplayValue(habitId: string, date: string): number {
    const draftValue = draftManager.drafts[habitId]?.[date];
    if (draftValue !== undefined) return draftValue;
    return (logs[habitId] ?? [])
      .filter((l) => l.date === date && !(l._id in draftManager.deletedLogIds))
      .reduce((s, l) => s + l.value, 0);
  }

  function getDisplayValueForDates(habitId: string, dates: string[]): number {
    const set = new Set(dates);
    const draftKey = `WEEK:${dates[0]}`;
    const draftValue = draftManager.drafts[habitId]?.[draftKey];
    if (draftValue !== undefined) return draftValue;
    return (logs[habitId] ?? [])
      .filter((l) => set.has(l.date) && !(l._id in draftManager.deletedLogIds))
      .reduce((s, l) => s + l.value, 0);
  }

  function getDisplayValueForMonth(habitId: string, mKey: string): number {
    const draftKey = `MONTH:${mKey}`;
    const draftValue = draftManager.drafts[habitId]?.[draftKey];
    if (draftValue !== undefined) return draftValue;
    return (logs[habitId] ?? [])
      .filter((l) => monthKey(l.date) === mKey && !(l._id in draftManager.deletedLogIds))
      .reduce((s, l) => s + l.value, 0);
  }

  function getDisplayValueForWeek(habitId: string, dates: string[]): number {
    const draftKey = `WEEK:${dates[0]}`;
    const draftValue = draftManager.drafts[habitId]?.[draftKey];
    if (draftValue !== undefined) return draftValue;
    return sumForDates(habitId, dates);
  }

  function getDisplayValueForMonthKey(habitId: string, mKey: string): number {
    const draftKey = `MONTH:${mKey}`;
    const draftValue = draftManager.drafts[habitId]?.[draftKey];
    if (draftValue !== undefined) return draftValue;
    return sumForMonth(habitId, mKey);
  }

  // Sum helpers
  function sumForDates(habitId: string, dates: string[]): number {
    const set = new Set(dates);
    return (logs[habitId] ?? [])
      .filter((l) => set.has(l.date) && !(l._id in draftManager.deletedLogIds))
      .reduce((s, l) => s + l.value, 0);
  }

  function sumForMonth(habitId: string, mKey: string): number {
    return (logs[habitId] ?? [])
      .filter((l) => monthKey(l.date) === mKey && !(l._id in draftManager.deletedLogIds))
      .reduce((s, l) => s + l.value, 0);
  }

  // Calculate streaks for all habits when logs change
  const habitsWithStreaks = React.useMemo(() => {
    return (habitsQuery.data ?? []).map((habit) => {
      const habitLogs = logs[habit._id] ?? [];
      const streaks = calculateStreaks(habit, habitLogs);
      return {
        ...habit,
        currentStreak: streaks.currentStreak,
        personalBest: streaks.personalBest,
      };
    });
  }, [habitsQuery.data, logs]);

  // Save drafts with minimum loading time
  const saveDrafts = React.useCallback(async () => {
    const startTime = Date.now();
    const MIN_LOADING_TIME = HABIT_TRACKING_CONSTANTS.MIN_LOADING_TIME_MS;

    try {
      // Prepare updates and deletions
      const updates: Array<{ habitId: string; date: string; value: number }> = [];
      const logsToDelete: Array<{ habitId: string; logId: string }> = [];

      Object.entries(draftManager.drafts).forEach(([habitId, draftEntries]) => {
        Object.entries(draftEntries).forEach(([draftKey, value]) => {
          const existingLogs = logs[habitId] ?? [];

          // Handle weekly entries (key format: "WEEK:2026-05-27")
          if (draftKey.startsWith('WEEK:')) {
            const dateStr = draftKey.substring(5); // Remove "WEEK:" prefix
            const weekRow = WEEKLY_ROW_LABELS.find((w) => w.dates[0] === dateStr);

            if (weekRow) {
              // Mark all logs in this week for deletion
              weekRow.dates.forEach((weekDate) => {
                existingLogs
                  .filter((l) => l.date === weekDate)
                  .forEach((log) => {
                    logsToDelete.push({ habitId, logId: log._id });
                  });
              });
              // Create single update for the week
              updates.push({ habitId, date: dateStr, value });
            }
          }
          // Handle monthly entries (key format: "MONTH:2026-06")
          else if (draftKey.startsWith('MONTH:')) {
            const mKey = draftKey.substring(6); // Remove "MONTH:" prefix
            // Mark all logs in this month for deletion
            existingLogs
              .filter((l) => monthKey(l.date) === mKey)
              .forEach((log) => {
                logsToDelete.push({ habitId, logId: log._id });
              });
            // Create update for the month (using first day as the date)
            updates.push({ habitId, date: `${mKey}-01`, value });
          }
          // Handle daily entries (regular date format: "2026-06-01")
          else {
            // Mark existing logs for this date for deletion
            existingLogs
              .filter((l) => l.date === draftKey)
              .forEach((log) => {
                logsToDelete.push({ habitId, logId: log._id });
              });
            updates.push({ habitId, date: draftKey, value });
          }
        });
      });

      // Also add explicitly deleted logs (not drafts, but marked for deletion)
      Object.entries(draftManager.deletedLogIds).forEach(([logId, habitId]) => {
        logsToDelete.push({ habitId, logId });
      });

      // Execute batch save mutation
      if (updates.length > 0 || logsToDelete.length > 0) {
        await mutations.batchSaveMutation.mutateAsync({
          updates,
          logsToDelete,
        });
      }

      // Clear drafts only after successful save
      draftManager.clearAllDrafts();
    } catch (err) {
      console.error('Error saving drafts:', err);
      throw err;
    } finally {
      // Enforce minimum loading time
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsedTime);
      if (remainingTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, remainingTime));
      }
    }
  }, [draftManager, logs, mutations.batchSaveMutation, WEEKLY_ROW_LABELS]);

  return {
    habits: habitsWithStreaks,
    logs,
    drafts: draftManager.drafts,
    deletedLogIds: draftManager.deletedLogIds,
    loading,
    isSaving: mutations.isSaving,
    savingLogIds: new Set<string>(),
    error,
    addLog,
    editLog,
    editWeeklyLog,
    editMonthlyLog,
    undoLog,
    undoWeeklyLog,
    undoMonthlyLog,
    getDisplayValue,
    getDisplayValueForDates,
    getDisplayValueForMonth,
    getDisplayValueForWeek,
    getDisplayValueForMonthKey,
    saveDrafts,
    hasUnsavedChanges: draftManager.hasUnsavedChanges,
    ITEMS_PER_PAGE: HABIT_TRACKING_CONSTANTS.ITEMS_PER_PAGE,
    TODAY,
  };
}
