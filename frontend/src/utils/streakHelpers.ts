import { Habit, HabitLog, HabitFrequency } from '@/types/habit';
import { getTodayDate, monthKey } from './dateHelpers';

export interface StreakData {
  currentStreak: number;
  personalBest: number;
}

export function calculateStreaks(habit: Habit, logs: HabitLog[]): StreakData {
  const today = getTodayDate();

  if (habit.frequency === HabitFrequency.Daily) {
    return calculateDailyStreaks(logs, habit.targetValue, today);
  } else if (habit.frequency === HabitFrequency.Weekly) {
    return calculateWeeklyStreaks(logs, habit.targetValue, today);
  } else if (habit.frequency === HabitFrequency.Monthly) {
    return calculateMonthlyStreaks(logs, habit.targetValue, today);
  }

  return { currentStreak: 0, personalBest: 0 };
}

function calculateDailyStreaks(logs: HabitLog[], targetValue: number, today: string): StreakData {
  // Group logs by date and sum values
  const logsByDate = new Map<string, number>();
  logs.forEach((log) => {
    const current = logsByDate.get(log.date) ?? 0;
    logsByDate.set(log.date, current + log.value);
  });

  // Get all unique dates and sort them
  const dates = Array.from(logsByDate.keys()).sort();

  // Calculate current streak (from today backwards)
  let currentStreak = 0;
  const currentDate = new Date(today + 'T00:00:00');

  for (let i = 0; i < 365; i++) {
    const dateStr = dateToString(currentDate);
    const value = logsByDate.get(dateStr) ?? 0;

    if (value >= targetValue) {
      currentStreak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  // Calculate personal best (longest streak ever)
  let personalBest = 0;
  let streak = 0;

  for (const date of dates) {
    const value = logsByDate.get(date) ?? 0;
    if (value >= targetValue) {
      streak++;
    } else {
      if (streak > personalBest) {
        personalBest = streak;
      }
      streak = 0;
    }
  }
  if (streak > personalBest) {
    personalBest = streak;
  }

  return { currentStreak, personalBest };
}

function calculateWeeklyStreaks(logs: HabitLog[], targetValue: number, today: string): StreakData {
  // Group logs by week (using Monday as week start)
  const logsByWeek = new Map<string, number>();

  logs.forEach((log) => {
    const weekStart = getMondayOfWeek(log.date);
    const current = logsByWeek.get(weekStart) ?? 0;
    logsByWeek.set(weekStart, current + log.value);
  });

  // Get all unique weeks and sort them
  const weeks = Array.from(logsByWeek.keys()).sort().reverse(); // Most recent first

  // Calculate current streak (from this week backwards)
  let currentStreak = 0;
  const currentDate = new Date(today + 'T00:00:00');
  let currentWeekStart = getMondayOfWeek(today);

  for (let i = 0; i < 52; i++) {
    const value = logsByWeek.get(currentWeekStart) ?? 0;

    if (value >= targetValue) {
      currentStreak++;
      // Move to previous week
      currentDate.setDate(currentDate.getDate() - 7);
      currentWeekStart = getMondayOfWeek(dateToString(currentDate));
    } else {
      break;
    }
  }

  // Calculate personal best
  let personalBest = 0;
  let streak = 0;

  for (const week of weeks.reverse()) {
    const value = logsByWeek.get(week) ?? 0;
    if (value >= targetValue) {
      streak++;
    } else {
      if (streak > personalBest) {
        personalBest = streak;
      }
      streak = 0;
    }
  }
  if (streak > personalBest) {
    personalBest = streak;
  }

  return { currentStreak, personalBest };
}

function calculateMonthlyStreaks(logs: HabitLog[], targetValue: number, today: string): StreakData {
  // Group logs by month
  const logsByMonth = new Map<string, number>();

  logs.forEach((log) => {
    const mKey = monthKey(log.date);
    const current = logsByMonth.get(mKey) ?? 0;
    logsByMonth.set(mKey, current + log.value);
  });

  // Get all unique months and sort them
  const months = Array.from(logsByMonth.keys()).sort();

  // Get current month
  const currentMonth = monthKey(today);

  // Calculate current streak (from this month backwards)
  let currentStreak = 0;
  let checkMonth = currentMonth;

  for (let i = 0; i < 24; i++) {
    const value = logsByMonth.get(checkMonth) ?? 0;

    if (value >= targetValue) {
      currentStreak++;
      // Move to previous month
      const [year, month] = checkMonth.split('-');
      let prevMonth = parseInt(month) - 1;
      let prevYear = parseInt(year);

      if (prevMonth === 0) {
        prevMonth = 12;
        prevYear--;
      }

      checkMonth = `${prevYear}-${String(prevMonth).padStart(2, '0')}`;
    } else {
      break;
    }
  }

  // Calculate personal best
  let personalBest = 0;
  let streak = 0;

  for (const month of months) {
    const value = logsByMonth.get(month) ?? 0;
    if (value >= targetValue) {
      streak++;
    } else {
      if (streak > personalBest) {
        personalBest = streak;
      }
      streak = 0;
    }
  }
  if (streak > personalBest) {
    personalBest = streak;
  }

  return { currentStreak, personalBest };
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
