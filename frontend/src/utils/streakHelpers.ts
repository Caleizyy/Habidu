import { Habit, HabitLog, HabitFrequency } from '@/types/habit';
import { getTodayDate, monthKey } from './dateHelpers';

export interface StreakData {
  currentStreak: number;
  personalBest: number;
}

function getPeriodKey(date: string, frequency: HabitFrequency): string {
  if (frequency === HabitFrequency.Daily) return date;
  if (frequency === HabitFrequency.Weekly) return getMondayOfWeek(date);
  return monthKey(date); // Monthly
}

function getCurrentPeriod(today: string, frequency: HabitFrequency): string {
  if (frequency === HabitFrequency.Daily) return today;
  if (frequency === HabitFrequency.Weekly) return getMondayOfWeek(today);
  return monthKey(today); // Monthly
}

function getNextPeriod(period: string, frequency: HabitFrequency): string {
  if (frequency === HabitFrequency.Daily) {
    const date = new Date(period + 'T00:00:00');
    date.setDate(date.getDate() + 1);
    return dateToString(date);
  }

  if (frequency === HabitFrequency.Weekly) {
    const date = new Date(period + 'T00:00:00');
    date.setDate(date.getDate() + 7);
    return getMondayOfWeek(dateToString(date));
  }

  // Monthly
  const [year, month] = period.split('-');
  let nextMonth = parseInt(month) + 1;
  let nextYear = parseInt(year);

  if (nextMonth === 13) {
    nextMonth = 1;
    nextYear++;
  }

  return `${nextYear}-${String(nextMonth).padStart(2, '0')}`;
}

function getPreviousPeriod(period: string, frequency: HabitFrequency): string {
  if (frequency === HabitFrequency.Daily) {
    const date = new Date(period + 'T00:00:00');
    date.setDate(date.getDate() - 1);
    return dateToString(date);
  }

  if (frequency === HabitFrequency.Weekly) {
    const date = new Date(period + 'T00:00:00');
    date.setDate(date.getDate() - 7);
    return getMondayOfWeek(dateToString(date));
  }

  // Monthly
  const [year, month] = period.split('-');
  let prevMonth = parseInt(month) - 1;
  let prevYear = parseInt(year);

  if (prevMonth === 0) {
    prevMonth = 12;
    prevYear--;
  }

  return `${prevYear}-${String(prevMonth).padStart(2, '0')}`;
}

function getMaxIterations(frequency: HabitFrequency): number {
  if (frequency === HabitFrequency.Daily) return 365;
  if (frequency === HabitFrequency.Weekly) return 52;
  return 24; // Monthly
}

function dateToString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getMondayOfWeek(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  return dateToString(monday);
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

  // Group logs by period and sum values
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

  // Calculate personal best by iterating forward from earliest period to today
  let personalBest = 0;
  let streak = 0;
  let checkPeriod2 = earliestPeriod;

  while (true) {
    const value = logsByPeriod.get(checkPeriod2) ?? 0;

    // Only increment streak if the period has enough value
    if (value >= targetValue) {
      streak++;
      personalBest = Math.max(personalBest, streak);
    } else {
      // Any period without enough value breaks the streak
      streak = 0;
    }

    // Stop if we've reached the current period
    if (checkPeriod2 === currentPeriod) {
      break;
    }

    // Move to next period
    checkPeriod2 = getNextPeriod(checkPeriod2, frequency);
  }

  return { currentStreak, personalBest };
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

  // Get all unique periods from all habits' logs
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

  // Calculate current streak (from today backwards)
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

  // Calculate personal best by iterating forward from earliest period to today
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

    // Only increment streak if ALL habits are complete in this period
    if (allHabitsComplete) {
      streak++;
      personalBest = Math.max(personalBest, streak);
    } else {
      // Any period where not all habits are complete breaks the streak
      streak = 0;
    }

    // Stop if we've reached the current period
    if (checkPeriod2 === currentPeriod) {
      break;
    }

    // Move to next period
    checkPeriod2 = getNextPeriod(checkPeriod2, frequency);
  }

  return { currentStreak, personalBest };
}

export function calculateStreaks(habit: Habit, logs: HabitLog[]): StreakData {
  const today = getTodayDate();
  return calculateStreakByPeriod(logs, habit.targetValue, today, habit.frequency);
}

export function calculateSectionStreaks(
  habits: Habit[],
  logs: Record<string, HabitLog[]>,
  frequency: HabitFrequency
): StreakData {
  const today = getTodayDate();
  return calculateSectionStreakByPeriod(habits, logs, today, frequency);
}
