import * as React from 'react';
import { Habit, HabitLog } from '@/types/habit';
import { fetchHabits, fetchLogsForHabit, deleteLog, upsertLog } from '@/api/habit';
import { monthKey, getTodayDate } from '@/utils/habitHelpers';
import { HABIT_TRACKING_CONSTANTS } from '@/constants/HabitTracking.constants';

export function useHabitLogs(WEEKLY_ROW_LABELS: Array<{ weekKey: string; label: string; dates: string[] }>) {
  const TODAY = getTodayDate();

  const [habits, setHabits] = React.useState<Habit[]>([]);
  const [logs, setLogs] = React.useState<Record<string, HabitLog[]>>({});
  const [drafts, setDrafts] = React.useState<Record<string, Record<string, number>>>({});
  const [deletedLogIds, setDeletedLogIds] = React.useState<Record<string, string>>({});
  const [loading, setLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [savingLogIds, setSavingLogIds] = React.useState<Set<string>>(new Set());
  const [error, setError] = React.useState<string | null>(null);

  const [pastDaysOpen, setPastDaysOpen] = React.useState(false);
  const [pastWeeksOpen, setPastWeeksOpen] = React.useState(false);
  const [pastMonthsOpen, setPastMonthsOpen] = React.useState(false);

  const [pastDaysPage, setPastDaysPage] = React.useState(1);
  const [pastWeeksPage, setPastWeeksPage] = React.useState(1);
  const [pastMonthsPage, setPastMonthsPage] = React.useState(1);

  const [expandedDailyDate, setExpandedDailyDate] = React.useState<string | null>(null);
  const [expandedPastWeek, setExpandedPastWeek] = React.useState<string | null>(null);
  const [expandedPastMonth, setExpandedPastMonth] = React.useState<string | null>(null);

  // Load data
  React.useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        // Calculate date range: last 1 year from today
        const todayDate = new Date(TODAY + 'T00:00:00');
        const oneYearAgo = new Date(todayDate);
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        const startDate = `${oneYearAgo.getFullYear()}-${String(oneYearAgo.getMonth() + 1).padStart(2, '0')}-${String(oneYearAgo.getDate()).padStart(2, '0')}`;
        const endDate = TODAY;

        // Fetch all habits
        const habitsData = await fetchHabits();
        setHabits(habitsData);

        // Fetch logs for each habit
        const logsData: Record<string, HabitLog[]> = {};
        await Promise.all(
          habitsData.map(async (habit) => {
            try {
              logsData[habit._id] = await fetchLogsForHabit(habit._id, startDate, endDate);
            } catch (err) {
              console.error(`Failed to fetch logs for habit ${habit._id}:`, err);
              logsData[habit._id] = [];
            }
          })
        );
        setLogs(logsData);
      } catch (err) {
        const errorMessage = 'Unable to load your habits. Please refresh the page.';
        setError(errorMessage);
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [TODAY]);

  // Log management functions
  async function addLog(habitId: string, value: number, date: string = TODAY) {
    setDrafts((prev) => ({
      ...prev,
      [habitId]: { ...(prev[habitId] ?? {}), [date]: value },
    }));
  }

  async function editLog(habitId: string, date: string, newValue: number) {
    setDrafts((prev) => ({
      ...prev,
      [habitId]: { ...(prev[habitId] ?? {}), [date]: newValue },
    }));
  }

  async function undoLog(habitId: string, date: string) {
    const isDraft = drafts[habitId]?.[date] !== undefined;

    if (isDraft) {
      setDrafts((prev) => {
        const habitDrafts = { ...prev[habitId] };
        delete habitDrafts[date];
        return { ...prev, [habitId]: habitDrafts };
      });
    } else {
      const savedLogs = logs[habitId] ?? [];
      const logToDelete = savedLogs.find((l) => l.date === date);

      if (logToDelete) {
        setDeletedLogIds((prev) => ({
          ...prev,
          [logToDelete._id]: habitId,
        }));
      }
    }
  }

  // Display value helpers
  function getDisplayValue(habitId: string, date: string): number {
    const draftValue = drafts[habitId]?.[date];
    if (draftValue !== undefined) return draftValue;
    return (logs[habitId] ?? [])
      .filter((l) => l.date === date && !(l._id in deletedLogIds))
      .reduce((s, l) => s + l.value, 0);
  }

  function getDisplayValueForDates(habitId: string, dates: string[]): number {
    const set = new Set(dates);
    const todayDraft = drafts[habitId]?.[TODAY];
    if (todayDraft !== undefined) return todayDraft;
    return (logs[habitId] ?? [])
      .filter((l) => set.has(l.date) && !(l._id in deletedLogIds))
      .reduce((s, l) => s + l.value, 0);
  }

  function getDisplayValueForMonth(habitId: string, mKey: string): number {
    const todayDraft = drafts[habitId]?.[TODAY];
    if (todayDraft !== undefined && monthKey(TODAY) === mKey) return todayDraft;
    return (logs[habitId] ?? [])
      .filter((l) => monthKey(l.date) === mKey && !(l._id in deletedLogIds))
      .reduce((s, l) => s + l.value, 0);
  }

  function getDisplayValueForWeek(habitId: string, dates: string[]): number {
    const startDate = dates[0];
    const draftValue = drafts[habitId]?.[startDate];
    if (draftValue !== undefined) return draftValue;
    return sumForDates(habitId, dates);
  }

  function getDisplayValueForMonthKey(habitId: string, mKey: string): number {
    const firstDay = `${mKey}-01`;
    const draftValue = drafts[habitId]?.[firstDay];
    if (draftValue !== undefined) return draftValue;
    return sumForMonth(habitId, mKey);
  }

  // Sum helpers
  function sumForDates(habitId: string, dates: string[]): number {
    const set = new Set(dates);
    return (logs[habitId] ?? [])
      .filter((l) => set.has(l.date) && !(l._id in deletedLogIds))
      .reduce((s, l) => s + l.value, 0);
  }

  function sumForMonth(habitId: string, mKey: string): number {
    return (logs[habitId] ?? [])
      .filter((l) => monthKey(l.date) === mKey && !(l._id in deletedLogIds))
      .reduce((s, l) => s + l.value, 0);
  }

  // Check for unsaved changes
  const hasUnsavedChanges =
    Object.values(drafts).some((habitDrafts) => Object.keys(habitDrafts).length > 0) ||
    Object.keys(deletedLogIds).length > 0;

  // Save function with optimistic loading
  async function saveDrafts() {
    setIsSaving(true);
    const startTime = Date.now();
    const MIN_LOADING_TIME = HABIT_TRACKING_CONSTANTS.MIN_LOADING_TIME_MS;

    // Backup logs for rollback on failure
    const logsBackup = JSON.parse(JSON.stringify(logs));

    try {
      const updates: Array<{ habitId: string; date: string; value: number }> = [];
      Object.entries(drafts).forEach(([habitId, dates]) => {
        Object.entries(dates).forEach(([date, value]) => {
          updates.push({ habitId, date, value });
        });
      });

      const logsToDelete: Array<{ habitId: string; logId: string }> = [];
      for (const update of updates) {
        const existingLogs = logs[update.habitId] ?? [];
        const weekRow = WEEKLY_ROW_LABELS.find((w) => w.dates[0] === update.date);
        const isMonthlyEdit = update.date.endsWith('-01') && monthKey(update.date) === update.date.slice(0, 7);

        if (weekRow) {
          weekRow.dates.forEach((weekDate) => {
            const logsForDate = existingLogs.filter((l) => l.date === weekDate);
            logsForDate.forEach((log) => {
              logsToDelete.push({ habitId: update.habitId, logId: log._id });
            });
          });
        } else if (isMonthlyEdit) {
          const mKey = update.date.slice(0, 7);
          const logsForMonth = existingLogs.filter((l) => monthKey(l.date) === mKey);
          logsForMonth.forEach((log) => {
            logsToDelete.push({ habitId: update.habitId, logId: log._id });
          });
        } else {
          const logsForDate = existingLogs.filter((l) => l.date === update.date);
          logsForDate.forEach((log) => {
            logsToDelete.push({ habitId: update.habitId, logId: log._id });
          });
        }
      }

      // Optimistically update logs state
      setLogs((prevLogs) => {
        const newLogs = JSON.parse(JSON.stringify(prevLogs));

        // Remove deleted logs
        logsToDelete.forEach(({ habitId, logId }) => {
          if (newLogs[habitId]) {
            newLogs[habitId] = newLogs[habitId].filter((l: HabitLog) => l._id !== logId);
          }
        });

        return newLogs;
      });

      // Track which logs are being saved
      const logsBeingSaved = new Set<string>();
      logsToDelete.forEach(({ logId }) => logsBeingSaved.add(logId));

      // Make API calls (don't wait to update UI, but track completion)
      const deletionPromises = logsToDelete.map(({ habitId, logId }) => {
        logsBeingSaved.add(logId);
        return deleteLog(habitId, logId).catch((err) => {
          console.error(`Failed to delete log ${logId}:`, err);
          throw err;
        });
      });

      const creationPromises = updates.map(({ habitId, date, value }) => {
        const tempId = `temp-${habitId}-${date}-${Date.now()}`;
        logsBeingSaved.add(tempId);
        setSavingLogIds((prev) => new Set([...prev, tempId]));
        return upsertLog(habitId, date, value)
          .then((newLog) => {
            setSavingLogIds((prev) => {
              const updated = new Set(prev);
              updated.delete(tempId);
              updated.add(newLog._id);
              return updated;
            });
            // Optimistically add/update the log
            setLogs((prevLogs) => {
              const habitLogs = prevLogs[habitId] ?? [];
              // Check if a log for this date already exists
              const existingIndex = habitLogs.findIndex((l) => l.date === newLog.date);
              if (existingIndex >= 0) {
                // Update existing log
                const updated = [...habitLogs];
                updated[existingIndex] = newLog;
                return { ...prevLogs, [habitId]: updated };
              } else {
                // Add new log
                return { ...prevLogs, [habitId]: [...habitLogs, newLog] };
              }
            });
          })
          .catch((err) => {
            console.error(`Failed to upsert log for ${habitId} on ${date}:`, err);
            setSavingLogIds((prev) => {
              const updated = new Set(prev);
              updated.delete(tempId);
              return updated;
            });
            throw err;
          });
      });

      const deleteDeletionPromises = Object.entries(deletedLogIds).map(([logId, habitId]) => {
        logsBeingSaved.add(logId);
        return deleteLog(habitId, logId).catch((err) => {
          console.error(`Failed to delete log ${logId}:`, err);
          throw err;
        });
      });

      // Wait for all operations
      await Promise.all([...deletionPromises, ...creationPromises, ...deleteDeletionPromises]);

      // Remove deleted logs from state
      setLogs((prevLogs) => {
        const newLogs = JSON.parse(JSON.stringify(prevLogs));
        Object.entries(deletedLogIds).forEach(([logId, habitId]) => {
          if (newLogs[habitId]) {
            newLogs[habitId] = newLogs[habitId].filter((l: HabitLog) => l._id !== logId);
          }
        });
        return newLogs;
      });

      // Clear drafts and deleted logs
      setDrafts({});
      setDeletedLogIds({});
      setSavingLogIds(new Set());
      setError(null);
    } catch (err) {
      // Rollback on failure
      setLogs(logsBackup);
      setSavingLogIds(new Set());

      // User-friendly error messages
      const errorMessage =
        err instanceof Error && err.message.includes('Failed to')
          ? "Couldn't save your changes. Please try again."
          : 'Unable to save your logs. Check your connection and try again.';

      setError(errorMessage);
      console.error('Error saving drafts:', err);
    } finally {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsedTime);
      setTimeout(() => {
        setIsSaving(false);
      }, remainingTime);
    }
  }

  return {
    // State
    habits,
    logs,
    drafts,
    deletedLogIds,
    loading,
    isSaving,
    savingLogIds,
    error,
    pastDaysOpen,
    setPastDaysOpen,
    pastWeeksOpen,
    setPastWeeksOpen,
    pastMonthsOpen,
    setPastMonthsOpen,
    pastDaysPage,
    setPastDaysPage,
    pastWeeksPage,
    setPastWeeksPage,
    pastMonthsPage,
    setPastMonthsPage,
    expandedDailyDate,
    setExpandedDailyDate,
    expandedPastWeek,
    setExpandedPastWeek,
    expandedPastMonth,
    setExpandedPastMonth,
    // Functions
    addLog,
    editLog,
    undoLog,
    getDisplayValue,
    getDisplayValueForDates,
    getDisplayValueForMonth,
    getDisplayValueForWeek,
    getDisplayValueForMonthKey,
    saveDrafts,
    hasUnsavedChanges,
    // Constants
    ITEMS_PER_PAGE: HABIT_TRACKING_CONSTANTS.ITEMS_PER_PAGE,
    TODAY,
  };
}
