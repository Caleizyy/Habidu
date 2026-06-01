import { Habit, HabitLog, PeriodCell } from '@/types/habit';
import { getMondayOfWeek, monthKey } from './dateHelpers';

export function buildDailyCells(habit: Habit, logs: HabitLog[], dates: string[]): PeriodCell[] {
  const byDate: Record<string, number> = {};
  logs.forEach((l) => {
    byDate[l.date] = (byDate[l.date] ?? 0) + l.value;
  });
  return dates.map((date) => ({
    label: new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' }),
    value: byDate[date] ?? 0,
    target: habit.targetValue,
  }));
}

export function buildWeeklyCells(
  habit: Habit,
  logs: HabitLog[],
  weekLabels: Array<{ weekKey: string; label: string }>
): PeriodCell[] {
  const byWeek: Record<string, number> = {};
  logs.forEach((l) => {
    // Group logs by week using Monday date
    const monday = getMondayOfWeek(l.date);
    byWeek[monday] = (byWeek[monday] ?? 0) + l.value;
  });
  return weekLabels.map(({ weekKey, label }) => ({
    label,
    value: byWeek[weekKey] ?? 0,
    target: habit.targetValue,
  }));
}

export function buildMonthlyCells(habit: Habit, logs: HabitLog[], monthKeys: string[]): PeriodCell[] {
  const byMonth: Record<string, number> = {};
  logs.forEach((l) => {
    const k = monthKey(l.date);
    byMonth[k] = (byMonth[k] ?? 0) + l.value;
  });
  return monthKeys.map((k) => ({
    label: new Date(k + '-01T00:00:00').toLocaleDateString('en-US', { month: 'short' }),
    value: byMonth[k] ?? 0,
    target: habit.targetValue,
  }));
}
