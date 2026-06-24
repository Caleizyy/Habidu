import { Flame, Star } from 'lucide-react';

export interface SectionStreakDisplayProps {
  currentStreak: number;
  personalBest: number;
}

export function SectionStreakDisplay({ currentStreak, personalBest }: SectionStreakDisplayProps) {
  return (
    <div className="flex items-center gap-6">
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-1.5">
          <Flame className="h-5 w-5 fill-orange-500 text-orange-500" />
          <span className="text-base font-semibold text-neutral-700 dark:text-neutral-300">{currentStreak}</span>
        </div>
        <span className="hidden text-xs font-normal text-neutral-400 sm:block dark:text-neutral-500">
          Current streak
        </span>
      </div>

      <div className="flex flex-col items-center">
        <div className="flex items-center gap-1.5">
          <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
          <span className="text-base font-semibold text-neutral-700 dark:text-neutral-300">{personalBest}</span>
        </div>
        <span className="hidden text-xs font-normal text-neutral-400 sm:block dark:text-neutral-500">
          Personal best
        </span>
      </div>
    </div>
  );
}
