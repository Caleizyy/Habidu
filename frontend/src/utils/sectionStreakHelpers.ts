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

  const allPeriods = new Set<string>();
  habits.forEach((habit) => {
    (logs[habit._id] ?? []).forEach((log) => {
      allPeriods.add(getPeriodKey(log.date, frequency));
    });
  });

  const periods = Array.from(allPeriods).sort();
  const currentPeriod = getCurrentPeriod(today, frequency);
  const maxIterations = getMaxIterations(frequency);

  return computeStreakData(periods, currentPeriod, frequency, maxIterations, (period) =>
    habits.every((habit) => {
      const periodValue = (logs[habit._id] ?? [])
        .filter((l) => getPeriodKey(l.date, frequency) === period)
        .reduce((sum, l) => sum + l.value, 0);
      return periodValue >= habit.targetValue;
    })
  );
}
