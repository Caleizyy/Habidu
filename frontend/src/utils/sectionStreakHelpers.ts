import { Habit, HabitLog, HabitFrequency } from '@/types/habit';
import { getTodayDate } from './dateHelpers';
import { getPeriodKey, getCurrentPeriod, getMaxIterations } from './periodHelpers';
import { computeStreakData } from './streakCalculator';
import { StreakData } from '@/types/streak';

export type { StreakData };

export function calculateSectionStreaks(
  habits: Habit[],
  logs: Record<string, HabitLog[]>,
  frequency: HabitFrequency
): StreakData {
  if (habits.length === 0) {
    return { currentStreak: 0, personalBest: 0 };
  }

  const today = getTodayDate();

  // Pre-aggregate logs by period for each habit
  const logsByHabitAndPeriod = new Map<string, Map<string, number>>();
  habits.forEach((habit) => {
    const habitLogs = logs[habit._id] ?? [];
    const logsByPeriod = new Map<string, number>();
    habitLogs.forEach((log) => {
      const periodKey = getPeriodKey(log.date, frequency);
      logsByPeriod.set(periodKey, (logsByPeriod.get(periodKey) ?? 0) + log.value);
    });
    logsByHabitAndPeriod.set(habit._id, logsByPeriod);
  });

  const allPeriods = new Set<string>();
  logsByHabitAndPeriod.forEach((logsByPeriod) => {
    logsByPeriod.forEach((_, period) => {
      allPeriods.add(period);
    });
  });

  const periods = Array.from(allPeriods).sort();
  const currentPeriod = getCurrentPeriod(today, frequency);
  const maxIterations = getMaxIterations(frequency);

  return computeStreakData(periods, currentPeriod, frequency, maxIterations, (period) =>
    habits.every((habit) => {
      const periodValue = logsByHabitAndPeriod.get(habit._id)?.get(period) ?? 0;
      return periodValue >= habit.targetValue;
    })
  );
}
