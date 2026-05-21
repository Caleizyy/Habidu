import * as React from 'react';
import { HabitUnit } from '@/types/habit';

interface LogRowProps {
  periodLabel: string;
  periodSublabel?: string;
  value: number;
  target: number;
  unit: HabitUnit;
  isCurrentPeriod?: boolean;
  /** called when user taps "Log" — client sends quickLog:true, value:targetValue */
  onQuickLog: () => void;
  /** called when user manually edits — client sends quickLog:false, value:N */
  onEdit: (value: number) => void;
  /** called when user clicks "Undo" to delete the log entry */
  onUndo: () => void;
}

export function LogRow({
  periodLabel,
  periodSublabel,
  value,
  target,
  unit,
  isCurrentPeriod,
  onQuickLog,
  onEdit,
  onUndo,
}: LogRowProps) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(String(value));

  React.useEffect(() => {
    setDraft(String(value));
    // Exit editing mode if value changes externally (e.g., via undo)
    if (editing && value !== parseFloat(draft)) {
      setEditing(false);
    }
  }, [value, editing, draft]);

  const completed = value >= target && target > 0;
  const over = value > target;
  const ratio = target === 0 ? 0 : Math.min(value / target, 1);

  function commitEdit() {
    const n = parseFloat(draft);
    if (!isNaN(n) && n >= 0 && n !== value) onEdit(n);
    setEditing(false);
  }

  return (
    <div
      className={`flex w-full items-center gap-3 border-b border-neutral-100 px-4 text-left transition-colors last:border-b-0 dark:border-neutral-800 ${isCurrentPeriod ? 'bg-neutral-50 py-4 dark:bg-neutral-800/60' : 'py-3'} `}
    >
      {/* Status circle */}
      <div
        className={`flex shrink-0 items-center justify-center rounded-full transition-all ${isCurrentPeriod ? 'h-9 w-9' : 'h-7 w-7'} ${
          completed
            ? 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400'
            : 'bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500'
        }`}
      >
        {completed ? (
          <svg className={isCurrentPeriod ? 'h-5 w-5' : 'h-4 w-4'} viewBox="0 0 16 16" fill="none">
            <path
              d="M3 8l3.5 3.5L13 5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <span style={{ fontSize: isCurrentPeriod ? 10 : 9, fontFamily: 'monospace', fontWeight: 600 }}>
            {Math.round(ratio * 100)}%
          </span>
        )}
      </div>

      {/* Period label */}
      <div className="flex flex-col gap-0.5">
        <span
          className={`font-semibold text-neutral-800 dark:text-neutral-200 ${isCurrentPeriod ? 'text-base' : 'text-sm'}`}
        >
          {periodLabel}
        </span>
        {periodSublabel && <span className="text-xs text-neutral-400 dark:text-neutral-500">{periodSublabel}</span>}
      </div>

      {/* Progress bar */}
      <div className="mx-2 h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            over ? 'bg-green-300 dark:bg-green-800' : completed ? 'bg-green-500' : 'bg-amber-300'
          }`}
          style={{ width: `${ratio * 100}%` }}
        />
      </div>

      {/* Value / edit / badge */}
      <div className="flex shrink-0 items-center gap-2" onClick={(e) => e.stopPropagation()}>
        {/* Editable value */}
        {editing ? (
          <div className="flex items-center gap-1">
            <input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commitEdit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitEdit();
                if (e.key === 'Escape') setEditing(false);
              }}
              className="w-14 rounded border border-neutral-300 bg-white px-1.5 py-0.5 text-xs text-neutral-800 outline-none focus:border-green-500 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-200"
              style={{ fontFamily: 'monospace' }}
            />
            <span className="text-xs text-neutral-400 dark:text-neutral-500">{unit}</span>
          </div>
        ) : (
          <button
            onClick={() => {
              setDraft(String(value));
              setEditing(true);
            }}
            className="text-xs text-neutral-400 transition-colors hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-300"
            style={{ fontFamily: 'monospace' }}
          >
            {Math.round(value)}/{Math.round(target)} {unit}
          </button>
        )}

        {/* Status badge */}
        {completed ? (
          isCurrentPeriod ? (
            <button
              onClick={() => {
                setEditing(false);
                onUndo();
              }}
              className="cursor-pointer rounded-full bg-green-50 px-3 py-1.5 font-medium text-green-600 transition-colors hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
            >
              {over ? `+${Math.round(value - target)} ${unit}` : 'Undo'}
            </button>
          ) : (
            <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-600 dark:bg-green-900/30 dark:text-green-400">
              {over ? `+${Math.round(value - target)} ${unit}` : 'Done'}
            </span>
          )
        ) : isCurrentPeriod ? (
          <button
            onClick={onQuickLog}
            className={`cursor-pointer rounded-full bg-neutral-900 font-medium text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 ${isCurrentPeriod ? 'px-3 py-1.5 text-sm' : 'px-2.5 py-1 text-xs'}`}
          >
            Log
          </button>
        ) : (
          <span
            className={`rounded-full bg-neutral-100 font-medium text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500 ${isCurrentPeriod ? 'px-3 py-1.5 text-sm' : 'px-2.5 py-1 text-xs'}`}
          >
            Missed
          </span>
        )}
      </div>
    </div>
  );
}
