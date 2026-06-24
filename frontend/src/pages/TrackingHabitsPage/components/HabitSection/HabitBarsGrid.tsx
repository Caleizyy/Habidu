import { Habit, PeriodCell } from '@/types/habit';
import { PeriodColumnHeaders } from './PeriodColumnHeaders';
import { HabitProgressRow } from './HabitProgressRow';

export interface HabitBarsGridProps {
  habits: Habit[];
  barCellsMap: Record<string, PeriodCell[]>; // habitId -> cells for the bar
  highlightIndex: number;
}

export function HabitBarsGrid({ habits, barCellsMap, highlightIndex }: HabitBarsGridProps) {
  const firstHabitCells = habits.length > 0 ? (barCellsMap[habits[0]._id] ?? []) : [];

  return (
    <div className="border-b border-neutral-200 dark:border-neutral-700">
      <PeriodColumnHeaders cells={firstHabitCells} highlightIndex={highlightIndex} />

      <div className="flex flex-col gap-3 px-4 pb-4">
        {habits.map((habit) => (
          <HabitProgressRow key={habit._id} habit={habit} cells={barCellsMap[habit._id] ?? []} />
        ))}
      </div>
    </div>
  );
}
