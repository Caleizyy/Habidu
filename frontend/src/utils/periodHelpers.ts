import { HabitFrequency } from '@/types/habit';
import { monthKey, getMondayOfWeek } from './dateHelpers';
import { dateToString } from './dateHelpers';

export function getPeriodKey(date: string, frequency: HabitFrequency): string {
  if (frequency === HabitFrequency.Daily) return date;
  if (frequency === HabitFrequency.Weekly) return getMondayOfWeek(date);
  return monthKey(date); // Monthly
}

export function getCurrentPeriod(today: string, frequency: HabitFrequency): string {
  if (frequency === HabitFrequency.Daily) return today;
  if (frequency === HabitFrequency.Weekly) return getMondayOfWeek(today);
  return monthKey(today); // Monthly
}

export function getNextPeriod(period: string, frequency: HabitFrequency): string {
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

export function getPreviousPeriod(period: string, frequency: HabitFrequency): string {
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

// TODO: Now the range is one year. The Streak caclutaion and fetching should be redone.
// Now - A personal best older than 1 year won't appear.
// So streaks and personal best should be stored to some extent.
export function getMaxIterations(frequency: HabitFrequency): number {
  if (frequency === HabitFrequency.Daily) return 365;
  if (frequency === HabitFrequency.Weekly) return 52;
  return 24; // Monthly
}
