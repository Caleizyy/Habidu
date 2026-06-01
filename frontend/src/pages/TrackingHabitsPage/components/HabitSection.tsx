import * as React from 'react';
import { Habit, PeriodCell } from '@/types/habit';
import { ProgressBar } from './ProgressBar';

export interface HabitSectionProps {
  title: string;
  rangeLabel: string;
  habits: Habit[];
  barCellsMap: Record<string, PeriodCell[]>; // habitId -> cells for the bar
  children: React.ReactNode; // LogRows
  highlightIndex?: number; // Optional: column index to highlight instead of first (for daily section to highlight today)
}

export function HabitSection({
  title,
  rangeLabel,
  habits,
  barCellsMap,
  children,
  highlightIndex = 0,
}: HabitSectionProps) {
  const [open, setOpen] = React.useState(true);

  const firstHabitCells = habits.length > 0 ? (barCellsMap[habits[0]._id] ?? []) : [];

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800">
      {/* Section header */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 border-b border-neutral-200 bg-white px-4 py-3 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800/80"
      >
        <span className="text-sm font-bold tracking-wide text-neutral-800 uppercase dark:text-neutral-100">
          {title}
        </span>
        <span className="text-xs font-normal text-neutral-400 dark:text-neutral-500">{rangeLabel}</span>
        <svg
          className={`ml-auto h-4 w-4 text-neutral-400 transition-transform ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 16 16"
          fill="none"
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className={`overflow-hidden transition-all duration-500 ${open ? 'max-h-screen' : 'max-h-0'}`}>
        <>
          {/* Bars grid with header */}
          <div className="border-b border-neutral-200 dark:border-neutral-700">
            {/* Column headers (day/week/month labels) */}
            <div className="flex items-start gap-3 p-4 pb-2">
              <div className="w-44 shrink-0 text-sm text-neutral-700 dark:text-neutral-300" />
              <div className="flex-1">
                <div className="flex gap-1">
                  {firstHabitCells.map((cell, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-md px-1 py-0.5 text-center ${i === highlightIndex ? 'bg-blue-100 dark:bg-blue-950/50' : ''}`}
                    >
                      <span
                        className={`text-xs font-semibold ${i === highlightIndex ? 'text-blue-700 dark:text-blue-300' : 'text-neutral-600 dark:text-neutral-400'}`}
                        style={{ fontFamily: 'monospace' }}
                      >
                        {cell.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-24" />
            </div>

            {/* Habit progress bars */}
            <div className="flex flex-col gap-3 px-4 pb-4">
              {habits.map((habit) => (
                <div key={habit._id} className="flex items-center gap-3">
                  <span className="w-44 shrink-0 truncate text-sm text-neutral-700 dark:text-neutral-300">
                    {habit.name}
                  </span>
                  <div className="flex-1">
                    <ProgressBar cells={barCellsMap[habit._id] ?? []} showLabels={false} />
                  </div>
                  <span
                    className="w-24 shrink-0 text-right text-xs text-neutral-400 dark:text-neutral-500"
                    style={{ fontFamily: 'monospace' }}
                  >
                    {Math.round((barCellsMap[habit._id] ?? []).reduce((s, c) => s + c.value, 0))}/
                    {Math.round((barCellsMap[habit._id] ?? []).reduce((s, c) => s + c.target, 0))} {habit.targetUnit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Log rows */}
          <div>{children}</div>
        </>
      </div>
    </div>
  );
}
