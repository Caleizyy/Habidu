import { Habit, HabitLog, HabitFrequency } from '@/types/habit';
import { getTodayDate } from './dateHelpers';
import { getPeriodKey, getCurrentPeriod, getNextPeriod, getPreviousPeriod, getMaxIterations } from './periodHelpers';

export interface StreakData {
  currentStreak: number;
  personalBest: number;
}

function calculateStreakByPeriod(
  logs: HabitLog[],
  targetValue: number,
  today: string,
  frequency: HabitFrequency
): StreakData {
  if (logs.length === 0) {
    return { currentStreak: 0, personalBest: 0 };
  }

  const logsByPeriod = new Map<string, number>();
  logs.forEach((log) => {
    const periodKey = getPeriodKey(log.date, frequency);
    const current = logsByPeriod.get(periodKey) ?? 0;
    logsByPeriod.set(periodKey, current + log.value);
  });

  // Find the earliest period with logs
  const periods = Array.from(logsByPeriod.keys()).sort();
  if (periods.length === 0) {
    return { currentStreak: 0, personalBest: 0 };
  }

  const earliestPeriod = periods[0];
  const currentPeriod = getCurrentPeriod(today, frequency);
  const maxIterations = getMaxIterations(frequency);

  // Calculate current streak (from today backwards)
  let currentStreak = 0;
  let checkPeriod = currentPeriod;

  for (let i = 0; i < maxIterations; i++) {
    const value = logsByPeriod.get(checkPeriod) ?? 0;
    if (value >= targetValue) {
      currentStreak++;
      checkPeriod = getPreviousPeriod(checkPeriod, frequency);
    } else {
      break;
    }
  }

  // Calculate PR by iterating forward from earliest period to today
  let personalBest = 0;
  let streak = 0;
  let checkPeriod2 = earliestPeriod;

  while (true) {
    const value = logsByPeriod.get(checkPeriod2) ?? 0;

    if (value >= targetValue) {
      streak++;
      personalBest = Math.max(personalBest, streak);
    } else {
      streak = 0;
    }

    if (checkPeriod2 === currentPeriod) {
      break;
    }

    checkPeriod2 = getNextPeriod(checkPeriod2, frequency);
  }

  return { currentStreak, personalBest };
}

export function calculateStreaks(habit: Habit, logs: HabitLog[]): StreakData {
  const today = getTodayDate();
  return calculateStreakByPeriod(logs, habit.targetValue, today, habit.frequency);
}
