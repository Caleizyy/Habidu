import { Habit, HabitLog } from '@/types/habit';
import { getPeriodKey } from './periodHelpers';

const WEEK_PREFIX = 'WEEK:';
const MONTH_PREFIX = 'MONTH:';

function draftKeyToDate(key: string): string {
  if (key.startsWith(WEEK_PREFIX)) return key.slice(WEEK_PREFIX.length);
  if (key.startsWith(MONTH_PREFIX)) return `${key.slice(MONTH_PREFIX.length)}-01`;
  return key;
}

export function buildDisplayedLogs(
  habits: Habit[],
  logs: Record<string, HabitLog[]>,
  drafts: Record<string, Record<string, number>>,
  deletedLogIds: Record<string, string>
): Record<string, HabitLog[]> {
  const displayed: Record<string, HabitLog[]> = {};

  habits.forEach((habit) => {
    const habitId = habit._id;
    const savedLogs = (logs[habitId] ?? []).filter((log) => !(log._id in deletedLogIds));
    const habitDrafts = drafts[habitId];

    if (!habitDrafts || Object.keys(habitDrafts).length === 0) {
      displayed[habitId] = savedLogs;
      return;
    }

    // Map each draft to the period it overrides.
    const draftByPeriod = new Map<string, { date: string; value: number }>();
    Object.entries(habitDrafts).forEach(([key, value]) => {
      const date = draftKeyToDate(key);
      draftByPeriod.set(getPeriodKey(date, habit.frequency), { date, value });
    });

    // Drop saved logs in any period a draft overrides, then add synthetic draft logs.
    const merged = savedLogs.filter((log) => !draftByPeriod.has(getPeriodKey(log.date, habit.frequency)));
    draftByPeriod.forEach(({ date, value }, period) => {
      merged.push({ _id: `draft:${habitId}:${period}`, habitId, date, value });
    });

    displayed[habitId] = merged;
  });

  return displayed;
}
