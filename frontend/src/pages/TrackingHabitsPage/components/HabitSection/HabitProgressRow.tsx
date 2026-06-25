import { Habit, PeriodCell } from '@/types/habit';
import ProgressBar from './ProgressBar';

export interface HabitProgressRowProps {
  habit: Habit;
  cells: PeriodCell[];
}

const HabitProgressRow = ({ habit, cells }: HabitProgressRowProps) => {
  const total = Math.round(cells.reduce((s, c) => s + c.value, 0));
  const target = Math.round(cells.reduce((s, c) => s + c.target, 0));

  return (
    <div className="flex items-center gap-3">
      <span className="w-44 shrink-0 truncate text-sm text-neutral-700 dark:text-neutral-300">{habit.name}</span>
      <div className="flex-1">
        <ProgressBar cells={cells} showLabels={false} />
      </div>
      <span
        className="w-24 shrink-0 text-right text-xs text-neutral-400 dark:text-neutral-500"
        style={{ fontFamily: 'monospace' }}
      >
        {total}/{target} {habit.targetUnit}
      </span>
    </div>
  );
};

export default HabitProgressRow;
