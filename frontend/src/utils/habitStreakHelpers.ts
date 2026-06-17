import { Habit, HabitLog } from '@/types/habit';
import { getTodayDate } from './dateHelpers';
import { getPeriodKey, getCurrentPeriod, getMaxIterations } from './periodHelpers';
import { computeStreakData } from './streakCalculator';
import { StreakData } from '../types/streak';

export type { StreakData };

export function calculateStreaks(habit: Habit, logs: HabitLog[]): StreakData {
  const { frequency, targetValue } = habit;
  const today = getTodayDate();

  const logsByPeriod = new Map<string, number>();
  logs.forEach((log) => {
    const periodKey = getPeriodKey(log.date, frequency);
    logsByPeriod.set(periodKey, (logsByPeriod.get(periodKey) ?? 0) + log.value);
  });

  const periods = Array.from(logsByPeriod.keys()).sort();
  const currentPeriod = getCurrentPeriod(today, frequency);
  const maxIterations = getMaxIterations(frequency);

  return computeStreakData(
    periods,
    currentPeriod,
    frequency,
    maxIterations,
    (period) => (logsByPeriod.get(period) ?? 0) >= targetValue
  );
}
