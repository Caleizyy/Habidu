import { HabitFrequency } from '@/types/habit';
import { getNextPeriod, getPreviousPeriod } from './periodHelpers';
import { StreakData } from '@/types/streak';

export function computeStreakData(
  periods: string[],
  currentPeriod: string,
  frequency: HabitFrequency,
  maxIterations: number,
  isComplete: (period: string) => boolean
): StreakData {
  if (periods.length === 0) {
    return { currentStreak: 0, personalBest: 0 };
  }

  const earliestPeriod = periods[0];

  // Current streak - scan backwards, skip incomplete current period
  let currentStreak = 0;
  let checkPeriod = currentPeriod;

  // Skip current period if incomplete
  if (!isComplete(checkPeriod)) {
    checkPeriod = getPreviousPeriod(checkPeriod, frequency);
  }

  // Now count consecutive completed periods
  for (let i = 0; i < maxIterations; i++) {
    if (isComplete(checkPeriod)) {
      currentStreak++;
      checkPeriod = getPreviousPeriod(checkPeriod, frequency);
    } else {
      break;
    }
  }

  // Personal best - scan forwards from earliest period
  let personalBest = 0;
  let streak = 0;
  let checkPeriod2 = earliestPeriod;

  for (let i = 0; i < maxIterations; i++) {
    if (isComplete(checkPeriod2)) {
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
