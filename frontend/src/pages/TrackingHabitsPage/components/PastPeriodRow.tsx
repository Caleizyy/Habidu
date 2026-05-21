import * as React from 'react';

interface Habit {
  value: number;
  target: number;
}

interface PastPeriodRowProps {
  periodLabel: string;
  habits: Habit[];
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export function PastPeriodRow({ periodLabel, habits, isExpanded, onToggle, children }: PastPeriodRowProps) {
  // Calculate completion for each habit
  const habitStatuses = habits.map((habit) => {
    const completed = habit.value >= habit.target && habit.target > 0;
    const over = habit.value > habit.target;
    const ratio = habit.target === 0 ? 0 : Math.min(habit.value / habit.target, 1);
    return { completed, over, ratio };
  });

  // Count how many habits are fully completed
  const completedCount = habitStatuses.filter((h) => h.completed).length;

  return (
    <>
      <button
        onClick={onToggle}
        className={`flex w-full items-center gap-3 border-b border-neutral-100 px-4 py-3 text-left transition-colors last:border-b-0 ${isExpanded ? 'bg-blue-50 dark:bg-blue-950/20' : 'hover:bg-neutral-50 dark:hover:bg-neutral-700/30'}`}
      >
        {/* Status circle */}
        <div
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all ${
            completedCount === habits.length
              ? 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400'
              : 'bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500'
          } `}
        >
          {completedCount === habits.length ? (
            <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8l3.5 3.5L13 5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <span style={{ fontSize: 9, fontFamily: 'monospace', fontWeight: 600 }}>
              {completedCount}/{habits.length}
            </span>
          )}
        </div>

        {/* Period label */}
        <div className="w-40 shrink-0">
          <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">{periodLabel}</span>
        </div>

        {/* Progress bar with equal segments per habit */}
        <div className="mx-2 flex h-1.5 flex-1 gap-0.5">
          {habitStatuses.map((status, idx) => (
            <div key={idx} className="flex-1 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  status.over ? 'bg-green-300 dark:bg-green-800' : status.completed ? 'bg-green-500' : 'bg-amber-300'
                }`}
                style={{ width: `${status.ratio * 100}%` }}
              />
            </div>
          ))}
        </div>

        {/* Expand indicator */}
        <svg
          className={`h-4 w-4 shrink-0 text-neutral-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          viewBox="0 0 16 16"
          fill="none"
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Expanded habits list */}
      <div
        className={`overflow-hidden transition-all duration-350 ${
          isExpanded ? 'max-h-screen bg-blue-50 dark:bg-blue-950/20' : 'max-h-0'
        }`}
      >
        <div className="border-t-2 border-blue-200 dark:border-blue-900">{children}</div>
      </div>
    </>
  );
}
