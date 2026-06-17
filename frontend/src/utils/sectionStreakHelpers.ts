import { Habit, HabitLog, HabitFrequency } from '@/types/habit';
import { getTodayDate } from './dateHelpers';
import { getPeriodKey, getCurrentPeriod, getNextPeriod, getPreviousPeriod, getMaxIterations } from './periodHelpers';

export interface StreakData {
  currentStreak: number;
  personalBest: number;
}

function calculateSectionStreakByPeriod(
  habits: Habit[],
  logs: Record<string, HabitLog[]>,
  today: string,
  frequency: HabitFrequency
): StreakData {
  if (habits.length === 0) {
    return { currentStreak: 0, personalBest: 0 };
  }

  const allPeriods = new Set<string>();
  habits.forEach((habit) => {
    const habitLogs = logs[habit._id] ?? [];
    habitLogs.forEach((log) => {
      const periodKey = getPeriodKey(log.date, frequency);
      allPeriods.add(periodKey);
    });
  });

  const periods = Array.from(allPeriods).sort();
  if (periods.length === 0) {
    return { currentStreak: 0, personalBest: 0 };
  }

  const earliestPeriod = periods[0];
  const currentPeriod = getCurrentPeriod(today, frequency);
  const maxIterations = getMaxIterations(frequency);

  // Calculate current Streak (from today)
  let currentStreak = 0;
  let checkPeriod = currentPeriod;

  for (let i = 0; i < maxIterations; i++) {
    const allHabitsComplete = habits.every((habit) => {
      const habitLogs = logs[habit._id] ?? [];
      const periodValue = habitLogs
        .filter((l) => getPeriodKey(l.date, frequency) === checkPeriod)
        .reduce((sum, l) => sum + l.value, 0);
      return periodValue >= habit.targetValue;
    });

    if (allHabitsComplete) {
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
    const allHabitsComplete = habits.every((habit) => {
      const habitLogs = logs[habit._id] ?? [];
      const periodValue = habitLogs
        .filter((l) => getPeriodKey(l.date, frequency) === checkPeriod2)
        .reduce((sum, l) => sum + l.value, 0);
      return periodValue >= habit.targetValue;
    });

    if (allHabitsComplete) {
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

export function calculateSectionStreaks(
  habits: Habit[],
  logs: Record<string, HabitLog[]>,
  frequency: HabitFrequency
): StreakData {
  const today = getTodayDate();
  return calculateSectionStreakByPeriod(habits, logs, today, frequency);
}
