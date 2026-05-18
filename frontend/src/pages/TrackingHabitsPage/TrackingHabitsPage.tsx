<<<<<<< HEAD
import { PageLayout } from '@/components/layout/PageLayout';

export function TrackingHabitsPage() {
  return (
    <PageLayout title="Tracking Habits">
      <div></div>
    </PageLayout>
=======
import * as React from 'react';
import { Button } from '@/components/ui/Button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/Pagination';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';

// ---------------------------------------------------------------------------
// Backend types (mirrors your agreed CreateHabitLogBody + enums)
// ---------------------------------------------------------------------------

export enum HabitCategory {
  Sports = 'sports',
  Health = 'health',
  Study = 'study',
  Skills = 'skills',
  Chores = 'chores',
}

export enum HabitFrequency {
  Daily = 'daily',
  Weekly = 'weekly',
  Monthly = 'monthly',
}

export enum HabitUnit {
  Minutes = 'min',
  Hours = 'hours',
  Milliliters = 'ml',
  Liters = 'liters',
  Times = 'times',
  Pages = 'pages',
  Books = 'books',
  Kilometers = 'km',
}

/** Shape returned by GET /habits/:id  (MongoDB adds _id, createdAt) */
interface Habit {
  _id: string;
  name: string;
  category: HabitCategory;
  frequency: HabitFrequency;
  targetValue: number;
  targetUnit: HabitUnit;
}

/**
 * Shape returned by GET /habits/:id/logs?from=...&to=...
 * Also what POST /habits/:id/logs accepts (minus _id / createdAt).
 */
interface HabitLog {
  _id: string;
  habitId: string;
  date: string; // "YYYY-MM-DD"
  value: number;
}

// ---------------------------------------------------------------------------
// Frontend-only derived type — one cell in a ProgressBar
// Built client-side from (habit.targetValue × days) vs sum of logs
// ---------------------------------------------------------------------------

interface PeriodCell {
  label: string; // "Mon", "W20", "May"
  value: number; // sum of HabitLog.value for this period
  target: number; // habit.targetValue (× days for daily view)
}

// ---------------------------------------------------------------------------
// Mock data shaped exactly like real API responses would look
// GET /habits  →  Habit[]
// GET /habits/:id/logs?from=&to=  →  { habit: Habit, logs: HabitLog[] }
// ---------------------------------------------------------------------------

const TODAY = '2026-05-17';

const HABITS: Habit[] = [
  {
    _id: 'h1',
    name: 'Read 30 min',
    category: HabitCategory.Study,
    frequency: HabitFrequency.Daily,
    targetValue: 30,
    targetUnit: HabitUnit.Minutes,
  },
  {
    _id: 'h2',
    name: 'Drink 2 L Water',
    category: HabitCategory.Health,
    frequency: HabitFrequency.Daily,
    targetValue: 2000,
    targetUnit: HabitUnit.Milliliters,
  },
  {
    _id: 'h3',
    name: 'Morning Walk',
    category: HabitCategory.Sports,
    frequency: HabitFrequency.Daily,
    targetValue: 1,
    targetUnit: HabitUnit.Times,
  },
  {
    _id: 'h4',
    name: 'Deep Clean',
    category: HabitCategory.Chores,
    frequency: HabitFrequency.Weekly,
    targetValue: 1,
    targetUnit: HabitUnit.Times,
  },
  {
    _id: 'h5',
    name: 'Gym Session',
    category: HabitCategory.Sports,
    frequency: HabitFrequency.Weekly,
    targetValue: 3,
    targetUnit: HabitUnit.Times,
  },
  {
    _id: 'h6',
    name: 'Read a Book',
    category: HabitCategory.Study,
    frequency: HabitFrequency.Monthly,
    targetValue: 1,
    targetUnit: HabitUnit.Books,
  },
  {
    _id: 'h7',
    name: 'Dentist Checkup',
    category: HabitCategory.Health,
    frequency: HabitFrequency.Monthly,
    targetValue: 1,
    targetUnit: HabitUnit.Times,
  },
];

// Logs keyed by habitId — simulates what the API returns
const MOCK_LOGS: Record<string, HabitLog[]> = {
  h1: [
    { _id: 'l101', habitId: 'h1', date: '2026-05-11', value: 30 },
    { _id: 'l102', habitId: 'h1', date: '2026-05-12', value: 45 },
    { _id: 'l103', habitId: 'h1', date: '2026-05-13', value: 0 },
    { _id: 'l104', habitId: 'h1', date: '2026-05-14', value: 30 },
    { _id: 'l105', habitId: 'h1', date: '2026-05-15', value: 20 },
    { _id: 'l106', habitId: 'h1', date: '2026-05-16', value: 30 },
    { _id: 'l107', habitId: 'h1', date: '2026-05-17', value: 10 },
  ],
  h2: [
    { _id: 'l201', habitId: 'h2', date: '2026-05-11', value: 2000 },
    { _id: 'l202', habitId: 'h2', date: '2026-05-12', value: 1500 },
    { _id: 'l203', habitId: 'h2', date: '2026-05-13', value: 2200 },
    { _id: 'l204', habitId: 'h2', date: '2026-05-14', value: 2000 },
    { _id: 'l205', habitId: 'h2', date: '2026-05-15', value: 800 },
    { _id: 'l206', habitId: 'h2', date: '2026-05-16', value: 2000 },
    { _id: 'l207', habitId: 'h2', date: '2026-05-17', value: 0 },
  ],
  h3: [
    { _id: 'l301', habitId: 'h3', date: '2026-05-11', value: 1 },
    { _id: 'l302', habitId: 'h3', date: '2026-05-12', value: 1 },
    { _id: 'l303', habitId: 'h3', date: '2026-05-13', value: 0 },
    { _id: 'l304', habitId: 'h3', date: '2026-05-14', value: 1 },
    { _id: 'l305', habitId: 'h3', date: '2026-05-15', value: 1 },
    { _id: 'l306', habitId: 'h3', date: '2026-05-16', value: 0 },
    { _id: 'l307', habitId: 'h3', date: '2026-05-17', value: 1 },
  ],
  h4: [
    { _id: 'l401', habitId: 'h4', date: '2026-04-20', value: 1 },
    { _id: 'l402', habitId: 'h4', date: '2026-05-04', value: 1 },
  ],
  h5: [
    { _id: 'l501', habitId: 'h5', date: '2026-04-20', value: 1 },
    { _id: 'l502', habitId: 'h5', date: '2026-04-22', value: 1 },
    { _id: 'l503', habitId: 'h5', date: '2026-04-24', value: 1 },
    { _id: 'l504', habitId: 'h5', date: '2026-04-28', value: 1 },
    { _id: 'l505', habitId: 'h5', date: '2026-04-29', value: 1 },
    { _id: 'l506', habitId: 'h5', date: '2026-05-04', value: 1 },
    { _id: 'l507', habitId: 'h5', date: '2026-05-06', value: 1 },
    { _id: 'l508', habitId: 'h5', date: '2026-05-07', value: 1 },
    { _id: 'l509', habitId: 'h5', date: '2026-05-12', value: 1 },
  ],
  h6: [
    { _id: 'l601', habitId: 'h6', date: '2026-01-28', value: 1 },
    { _id: 'l602', habitId: 'h6', date: '2026-02-20', value: 1 },
    { _id: 'l603', habitId: 'h6', date: '2026-04-15', value: 1 },
  ],
  h7: [
    { _id: 'l701', habitId: 'h7', date: '2026-01-10', value: 1 },
    { _id: 'l702', habitId: 'h7', date: '2026-03-12', value: 1 },
  ],
};

// ---------------------------------------------------------------------------
// Helpers — build PeriodCell[] from raw logs + habit (pure frontend logic)
// This is what you'd do after receiving { habit, logs } from the API.
// ---------------------------------------------------------------------------

/** "2026-05-17" → "YYYY-WXX" ISO week key */
function isoWeek(dateStr: string): string {
  const d = new Date(dateStr);
  const day = d.getUTCDay() === 0 ? 7 : d.getUTCDay();
  const thu = new Date(d);
  thu.setUTCDate(d.getUTCDate() + 4 - day);
  const jan1 = new Date(Date.UTC(thu.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((thu.getTime() - jan1.getTime()) / 86400000 + 1) / 7);
  return `${thu.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

/** "2026-05-17" → "2026-05" */
function monthKey(dateStr: string): string {
  return dateStr.slice(0, 7);
}

function buildDailyCells(habit: Habit, logs: HabitLog[], dates: string[]): PeriodCell[] {
  const byDate: Record<string, number> = {};
  logs.forEach((l) => {
    byDate[l.date] = (byDate[l.date] ?? 0) + l.value;
  });
  return dates.map((date) => ({
    label: new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2),
    value: byDate[date] ?? 0,
    target: habit.targetValue,
  }));
}

function buildWeeklyCells(habit: Habit, logs: HabitLog[], weekKeys: string[]): PeriodCell[] {
  const byWeek: Record<string, number> = {};
  logs.forEach((l) => {
    const k = isoWeek(l.date);
    byWeek[k] = (byWeek[k] ?? 0) + l.value;
  });
  return weekKeys.map((k) => ({
    label: 'W' + k.split('-W')[1],
    value: byWeek[k] ?? 0,
    target: habit.targetValue,
  }));
}

function buildMonthlyCells(habit: Habit, logs: HabitLog[], monthKeys: string[]): PeriodCell[] {
  const byMonth: Record<string, number> = {};
  logs.forEach((l) => {
    const k = monthKey(l.date);
    byMonth[k] = (byMonth[k] ?? 0) + l.value;
  });
  return monthKeys.map((k) => ({
    label: new Date(k + '-01T00:00:00').toLocaleDateString('en-US', { month: 'short' }),
    value: byMonth[k] ?? 0,
    target: habit.targetValue,
  }));
}

// Fixed windows for the mock
const DAILY_DATES = ['2026-05-11', '2026-05-12', '2026-05-13', '2026-05-14', '2026-05-15', '2026-05-16', '2026-05-17'];
const WEEKLY_KEYS = ['2026-W17', '2026-W18', '2026-W19', '2026-W20'];
const MONTHLY_KEYS = ['2026-01', '2026-02', '2026-03', '2026-04', '2026-05'];

/** Format date range "2026-05-11" to "May 11" */
function formatDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/** Format a date range like "May 11 - May 17" */
function formatDateRange(startDate: string, endDate: string): string {
  const start = formatDate(startDate);
  const end = formatDate(endDate);
  return `${start} - ${end}`;
}

// Human-readable period labels for log rows
const DAILY_ROW_LABELS: Array<{ date: string; label: string; sublabel?: string }> = [
  { date: '2026-05-17', label: 'May 17', sublabel: 'Today' },
  { date: '2026-05-16', label: 'May 16' },
  { date: '2026-05-15', label: 'May 15' },
  { date: '2026-05-14', label: 'May 14' },
  { date: '2026-05-13', label: 'May 13' },
  { date: '2026-05-12', label: 'May 12' },
  { date: '2026-05-11', label: 'May 11' },
];

const WEEKLY_ROW_LABELS: Array<{ weekKey: string; label: string; sublabel?: string; dates: string[] }> = [
  {
    weekKey: '2026-W20',
    label: formatDateRange('2026-05-11', '2026-05-17'),
    sublabel: 'This week',
    dates: ['2026-05-11', '2026-05-12', '2026-05-13', '2026-05-14', '2026-05-15', '2026-05-16', '2026-05-17'],
  },
  {
    weekKey: '2026-W19',
    label: formatDateRange('2026-05-04', '2026-05-10'),
    dates: ['2026-05-04', '2026-05-05', '2026-05-06', '2026-05-07', '2026-05-08', '2026-05-09', '2026-05-10'],
  },
  {
    weekKey: '2026-W18',
    label: formatDateRange('2026-04-27', '2026-05-03'),
    dates: ['2026-04-27', '2026-04-28', '2026-04-29', '2026-04-30', '2026-05-01', '2026-05-02', '2026-05-03'],
  },
  {
    weekKey: '2026-W17',
    label: formatDateRange('2026-04-20', '2026-04-26'),
    dates: ['2026-04-20', '2026-04-21', '2026-04-22', '2026-04-23', '2026-04-24', '2026-04-25', '2026-04-26'],
  },
];

const MONTHLY_ROW_LABELS: Array<{ monthKey: string; label: string; sublabel?: string }> = [
  { monthKey: '2026-05', label: 'May 2026', sublabel: 'This month' },
  { monthKey: '2026-04', label: 'Apr 2026' },
  { monthKey: '2026-03', label: 'Mar 2026' },
  { monthKey: '2026-02', label: 'Feb 2026' },
  { monthKey: '2026-01', label: 'Jan 2026' },
];

// ---------------------------------------------------------------------------
// PastPeriodRow — collapsible row for past periods (weeks/months)
// Shows aggregate progress, expands to show individual habits
// ---------------------------------------------------------------------------

interface PastPeriodRowProps {
  periodLabel: string;
  value: number;
  target: number;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode; // Individual habit rows
}

function PastPeriodRow({ periodLabel, value, target, isExpanded, onToggle, children }: PastPeriodRowProps) {
  const completed = value >= target && target > 0;
  const over = value > target;
  const ratio = target === 0 ? 0 : Math.min(value / target, 1);

  return (
    <>
      <button
        onClick={onToggle}
        className={`flex w-full items-center gap-3 border-b border-neutral-100 px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-700/30`}
      >
        {/* Status circle */}
        <div
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all ${
            completed
              ? 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400'
              : 'bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500'
          } `}
        >
          {completed ? (
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
            <span style={{ fontSize: 9, fontFamily: 'monospace', fontWeight: 600 }}>{Math.round(ratio * 100)}%</span>
          )}
        </div>

        {/* Period label */}
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">{periodLabel}</span>
        </div>

        {/* Progress bar */}
        <div className="mx-2 h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              over ? 'bg-amber-400' : completed ? 'bg-green-500' : 'bg-green-300 dark:bg-green-800'
            }`}
            style={{ width: `${ratio * 100}%` }}
          />
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
      {isExpanded && (
        <div className="border-b border-neutral-100 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-800/50">
          {children}
        </div>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// HabitDetailRow — individual habit row shown in expanded past periods
// ---------------------------------------------------------------------------

interface HabitDetailRowProps {
  habitName: string;
  value: number;
  target: number;
  unit: HabitUnit;
}

function HabitDetailRow({ habitName, value, target, unit }: HabitDetailRowProps) {
  const completed = value >= target && target > 0;
  const ratio = target === 0 ? 0 : Math.min(value / target, 1);

  return (
    <div className="flex items-center gap-3 border-b border-neutral-100 px-4 py-2 last:border-b-0 dark:border-neutral-800/50">
      <div className="w-32 shrink-0 text-xs text-neutral-600 dark:text-neutral-400">{habitName}</div>

      <div className="h-1 flex-1 overflow-hidden rounded-full bg-neutral-300 dark:bg-neutral-700">
        <div
          className={`h-full rounded-full transition-all ${
            completed ? 'bg-green-500' : 'bg-green-300 dark:bg-green-800'
          }`}
          style={{ width: `${ratio * 100}%` }}
        />
      </div>

      <span className="shrink-0 font-mono text-xs text-neutral-500 dark:text-neutral-400">
        {Math.round(value)}/{Math.round(target)} {unit}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ProgressBar — reusable, works for daily (7 cells) / weekly (4-5) / monthly (12)
// ---------------------------------------------------------------------------

interface ProgressBarProps {
  cells: PeriodCell[];
}

interface ProgressBarProps {
  cells: PeriodCell[];
  showLabels?: boolean; // if false, labels go in header instead
}

function ProgressBar({ cells, showLabels = false }: ProgressBarProps) {
  return (
    <>
      {/* Labels header (only if showLabels is true) */}
      {showLabels && (
        <div className="mb-2 flex items-center gap-1">
          {cells.map((cell, i) => (
            <div key={i} className="flex-1 text-center">
              <span
                className="text-xs font-medium text-neutral-500 dark:text-neutral-400"
                style={{ fontFamily: 'monospace' }}
              >
                {cell.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Progress bars */}
      <div className="flex items-center gap-1">
        {cells.map((cell, i) => {
          const ratio = cell.target === 0 ? 0 : Math.min(cell.value / cell.target, 1);
          const completed = cell.value >= cell.target && cell.target > 0;
          const over = cell.value > cell.target;

          return (
            <div key={i} className="flex-1">
              {/* track — fills left to right */}
              <div
                className="w-full overflow-hidden rounded-sm bg-neutral-200 dark:bg-neutral-700"
                style={{ height: 10 }}
              >
                <div
                  className={`h-full rounded-sm transition-all duration-300 ${
                    over
                      ? 'bg-amber-400 dark:bg-amber-400'
                      : completed
                        ? 'bg-green-500 dark:bg-green-500'
                        : ratio > 0
                          ? 'bg-green-300 dark:bg-green-700'
                          : ''
                  }`}
                  style={{ width: `${ratio * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// LogRow — reusable across daily / weekly / monthly
// Receives the aggregated value+target for its period.
// onQuickLog / onEdit simulate POST /habits/:id/logs
// ---------------------------------------------------------------------------

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
}

function LogRow({
  periodLabel,
  periodSublabel,
  value,
  target,
  unit,
  isCurrentPeriod,
  onQuickLog,
  onEdit,
}: LogRowProps) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(String(value));

  React.useEffect(() => {
    setDraft(String(value));
  }, [value]);

  const completed = value >= target && target > 0;
  const over = value > target;
  const ratio = target === 0 ? 0 : Math.min(value / target, 1);

  function commitEdit() {
    const n = parseFloat(draft);
    if (!isNaN(n) && n >= 0) onEdit(n);
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
        } `}
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
            over ? 'bg-amber-400' : completed ? 'bg-green-500' : 'bg-green-300 dark:bg-green-800'
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
          <button
            onClick={() => onEdit(0)}
            className={`cursor-pointer rounded-full bg-green-50 font-medium text-green-600 transition-colors hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50 ${isCurrentPeriod ? 'px-3 py-1.5 text-sm' : 'px-2.5 py-1 text-xs'}`}
          >
            {over ? `+${Math.round(value - target)} ${unit}` : 'Done'}
          </button>
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

// ---------------------------------------------------------------------------
// HabitSection — one collapsible card per frequency group
// ---------------------------------------------------------------------------

interface HabitSectionProps {
  title: string;
  rangeLabel: string;
  habits: Habit[];
  barCellsMap: Record<string, PeriodCell[]>; // habitId → cells for the bar
  children: React.ReactNode; // LogRows
}

function HabitSection({ title, rangeLabel, habits, barCellsMap, children }: HabitSectionProps) {
  const [open, setOpen] = React.useState(true);

  // Get label columns from first habit's cells (all habits have same period structure)
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

      {open && (
        <>
          {/* Bars grid with header */}
          <div className="border-b border-neutral-200 dark:border-neutral-700">
            {/* Column headers (day/week/month labels) */}
            <div className="flex items-start gap-3 p-4 pb-2">
              <div className="w-44 shrink-0 text-sm text-neutral-700 dark:text-neutral-300" />
              <div className="flex-1">
                <div className="flex gap-1">
                  {firstHabitCells.map((cell, i) => (
                    <div key={i} className="flex-1 text-center">
                      <span
                        className="text-xs font-semibold text-neutral-600 dark:text-neutral-400"
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
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export function TrackingHabitsPage(): React.ReactNode {
  // Logs state — in production these come from the API
  const [logs, setLogs] = React.useState<Record<string, HabitLog[]>>(MOCK_LOGS);

  // Collapsible past sections state
  const [pastDaysOpen, setPastDaysOpen] = React.useState(false);
  const [pastWeeksOpen, setPastWeeksOpen] = React.useState(false);
  const [pastMonthsOpen, setPastMonthsOpen] = React.useState(false);

  // Pagination state for past sections (items per page)
  const ITEMS_PER_PAGE = 5;
  const [pastDaysPage, setPastDaysPage] = React.useState(1);
  const [pastWeeksPage, setPastWeeksPage] = React.useState(1);
  const [pastMonthsPage, setPastMonthsPage] = React.useState(1);

  // Expansion state for individual periods (dates, weeks, months)
  const [expandedDailyDates, setExpandedDailyDates] = React.useState<Set<string>>(new Set([TODAY]));
  const [expandedPastWeeks, setExpandedPastWeeks] = React.useState<Set<string>>(new Set());
  const [expandedPastMonths, setExpandedPastMonths] = React.useState<Set<string>>(new Set());

  // ---------------------------------------------------------------------------
  // Logging actions — these simulate what POST /habits/:id/logs would do locally
  // ---------------------------------------------------------------------------

  function addLog(habitId: string, value: number, date: string = TODAY) {
    const newLog: HabitLog = {
      _id: `local_${Date.now()}`,
      habitId,
      date,
      value,
    };
    setLogs((prev) => ({ ...prev, [habitId]: [...(prev[habitId] ?? []), newLog] }));
  }

  function editLog(habitId: string, date: string, newValue: number) {
    // Replace the sum for this date by removing old logs for that date
    // and inserting one corrected entry
    setLogs((prev) => {
      const without = (prev[habitId] ?? []).filter((l) => l.date !== date);
      const updated: HabitLog = { _id: `local_edit_${Date.now()}`, habitId, date, value: newValue };
      return { ...prev, [habitId]: [...without, updated] };
    });
  }

  // Aggregate helper: sum logs for a specific date
  function sumForDate(habitId: string, date: string): number {
    return (logs[habitId] ?? []).filter((l) => l.date === date).reduce((s, l) => s + l.value, 0);
  }

  // Aggregate helper: sum logs for a set of dates (week/month period)
  function sumForDates(habitId: string, dates: string[]): number {
    const set = new Set(dates);
    return (logs[habitId] ?? []).filter((l) => set.has(l.date)).reduce((s, l) => s + l.value, 0);
  }

  // Aggregate helper: sum logs for a specific month
  function sumForMonth(habitId: string, mKey: string): number {
    return (logs[habitId] ?? []).filter((l) => monthKey(l.date) === mKey).reduce((s, l) => s + l.value, 0);
  }

  // ---------------------------------------------------------------------------
  // Build bar cells from current logs state
  // ---------------------------------------------------------------------------

  const dailyHabits = HABITS.filter((h) => h.frequency === HabitFrequency.Daily);
  const weeklyHabits = HABITS.filter((h) => h.frequency === HabitFrequency.Weekly);
  const monthlyHabits = HABITS.filter((h) => h.frequency === HabitFrequency.Monthly);

  const dailyBarCells: Record<string, PeriodCell[]> = {};
  const weeklyBarCells: Record<string, PeriodCell[]> = {};
  const monthlyBarCells: Record<string, PeriodCell[]> = {};

  dailyHabits.forEach((h) => {
    dailyBarCells[h._id] = buildDailyCells(h, logs[h._id] ?? [], DAILY_DATES);
  });
  weeklyHabits.forEach((h) => {
    weeklyBarCells[h._id] = buildWeeklyCells(h, logs[h._id] ?? [], WEEKLY_KEYS);
  });
  monthlyHabits.forEach((h) => {
    monthlyBarCells[h._id] = buildMonthlyCells(h, logs[h._id] ?? [], MONTHLY_KEYS);
  });

  // ---------------------------------------------------------------------------
  // Stats
  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="container mx-auto py-8">
      <div className="rounded-2xl bg-white p-6 shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
        {/* Header */}
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">Tracking Habits</h1>
          <div className="ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Categories</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  {Object.values(HabitCategory).map((c) => (
                    <DropdownMenuItem key={c} className="capitalize">
                      {c}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* <hr className="my-4 border-neutral-200 dark:border-neutral-700" /> */}

        {/* Stats */}
        {/* <div className="rounded-xl border border-neutral-200 dark:border-neutral-700
          bg-neutral-50 dark:bg-neutral-800 px-5 py-4 flex items-center">
          <div className="flex-1 flex justify-center">
            <div className="flex items-center gap-2">
              <Flame className="w-8 h-8" />
              <div className="flex flex-col leading-tight">
                <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium uppercase tracking-wide">Streak</span>
                <span className="text-xl font-bold text-neutral-900 dark:text-white">12 days</span>
              </div>
            </div>
          </div>
          <div className="h-10 w-px bg-neutral-200 dark:bg-neutral-700" />
          <div className="flex-1 flex justify-center">
            <div className="flex items-center gap-2">
              <Trophy className="w-7 h-7" />
              <div className="flex flex-col leading-tight">
                <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium uppercase tracking-wide">Personal Best</span>
                <span className="text-xl font-bold text-neutral-900 dark:text-white">30 days</span>
              </div>
            </div>
          </div>
          <div className="h-10 w-px bg-neutral-200 dark:bg-neutral-700" />
          <div className="flex-1 flex justify-center">
            <div className="flex items-center gap-2">
              <ChartPie className="w-8 h-8" />
              <div className="flex flex-col leading-tight">
                <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium uppercase tracking-wide">Completion</span>
                <span className="text-xl font-bold text-neutral-900 dark:text-white">{completionPct}%</span>
              </div>
            </div>
          </div>
        </div> */}

        <hr className="my-4 border-neutral-200 dark:border-neutral-700" />

        {/* ── DAILY SECTION ── */}
        <HabitSection title="Daily" rangeLabel="May 11 – 17" habits={dailyHabits} barCellsMap={dailyBarCells}>
          {/* TODAY section */}
          {DAILY_ROW_LABELS.slice(0, 1).map((row) => {
            const combinedValue = dailyHabits.reduce((s, h) => s + sumForDate(h._id, row.date), 0);
            const combinedTarget = dailyHabits.reduce((s, h) => s + h.targetValue, 0);
            const isRowExpanded = expandedDailyDates.has(row.date);

            return (
              <PastPeriodRow
                key={`today-section-${row.date}`}
                periodLabel={`Today · ${row.label}`}
                value={combinedValue}
                target={combinedTarget}
                isExpanded={isRowExpanded}
                onToggle={() => {
                  const newSet = new Set(expandedDailyDates);
                  if (newSet.has(row.date)) {
                    newSet.delete(row.date);
                  } else {
                    newSet.add(row.date);
                  }
                  setExpandedDailyDates(newSet);
                }}
              >
                {dailyHabits.map((habit) => (
                  <LogRow
                    key={habit._id}
                    periodLabel={habit.name}
                    value={sumForDate(habit._id, row.date)}
                    target={habit.targetValue}
                    unit={habit.targetUnit}
                    isCurrentPeriod={true}
                    onQuickLog={() => addLog(habit._id, habit.targetValue, row.date)}
                    onEdit={(newVal) => editLog(habit._id, row.date, newVal)}
                  />
                ))}
              </PastPeriodRow>
            );
          })}

          {/* PAST section */}
          {DAILY_ROW_LABELS.slice(1).length > 0 && (
            <>
              <button
                onClick={() => setPastDaysOpen((o) => !o)}
                className="hover:bg-neutral-150 flex w-full items-center gap-2 border-b border-neutral-200 bg-neutral-100 px-4 py-2 transition-colors dark:border-neutral-700 dark:bg-neutral-800/80 dark:hover:bg-neutral-800"
              >
                <span className="text-xs font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
                  Past days
                </span>
                <svg
                  className={`ml-auto h-4 w-4 text-neutral-400 transition-transform ${pastDaysOpen ? 'rotate-180' : ''}`}
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M4 6l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {pastDaysOpen && (
                <>
                  {(() => {
                    const pastRows = DAILY_ROW_LABELS.slice(1);
                    const totalPages = Math.ceil(pastRows.length / ITEMS_PER_PAGE);
                    const start = (pastDaysPage - 1) * ITEMS_PER_PAGE;
                    const paginatedRows = pastRows.slice(start, start + ITEMS_PER_PAGE);

                    return (
                      <>
                        {paginatedRows.map((row) => {
                          const combinedValue = dailyHabits.reduce((s, h) => s + sumForDate(h._id, row.date), 0);
                          const combinedTarget = dailyHabits.reduce((s, h) => s + h.targetValue, 0);
                          const isRowExpanded = expandedDailyDates.has(row.date);

                          return (
                            <PastPeriodRow
                              key={row.date}
                              periodLabel={row.label}
                              value={combinedValue}
                              target={combinedTarget}
                              isExpanded={isRowExpanded}
                              onToggle={() => {
                                const newSet = new Set(expandedDailyDates);
                                if (newSet.has(row.date)) {
                                  newSet.delete(row.date);
                                } else {
                                  newSet.add(row.date);
                                }
                                setExpandedDailyDates(newSet);
                              }}
                            >
                              {dailyHabits.map((habit) => (
                                <LogRow
                                  key={habit._id}
                                  periodLabel={habit.name}
                                  value={sumForDate(habit._id, row.date)}
                                  target={habit.targetValue}
                                  unit={habit.targetUnit}
                                  isCurrentPeriod={false}
                                  onQuickLog={() => addLog(habit._id, habit.targetValue, row.date)}
                                  onEdit={(newVal) => editLog(habit._id, row.date, newVal)}
                                />
                              ))}
                            </PastPeriodRow>
                          );
                        })}

                        {/* Pagination for past days */}
                        <div className="border-t border-neutral-200 px-4 py-3 dark:border-neutral-700">
                          <Pagination>
                            <PaginationContent>
                              <PaginationItem>
                                <PaginationPrevious
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setPastDaysPage((p) => Math.max(1, p - 1));
                                  }}
                                  className={pastDaysPage === 1 ? 'pointer-events-none opacity-50' : ''}
                                />
                              </PaginationItem>
                              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                <PaginationItem key={pageNum}>
                                  <PaginationLink
                                    href="#"
                                    isActive={pageNum === pastDaysPage}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setPastDaysPage(pageNum);
                                    }}
                                  >
                                    {pageNum}
                                  </PaginationLink>
                                </PaginationItem>
                              ))}
                              <PaginationItem>
                                <PaginationNext
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setPastDaysPage((p) => Math.min(totalPages, p + 1));
                                  }}
                                  className={pastDaysPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                                />
                              </PaginationItem>
                            </PaginationContent>
                          </Pagination>
                        </div>
                      </>
                    );
                  })()}
                </>
              )}
            </>
          )}
        </HabitSection>

        <hr className="my-4 border-neutral-200 dark:border-neutral-700" />

        {/* ── WEEKLY SECTION ── */}
        <HabitSection title="Weekly" rangeLabel="W17 – W20" habits={weeklyHabits} barCellsMap={weeklyBarCells}>
          {/* THIS WEEK section */}
          {WEEKLY_ROW_LABELS.slice(0, 1).map((row) => {
            return (
              <div key={`this-week-section-${row.weekKey}`}>
                <div className="flex items-center gap-2 border-y-2 border-blue-200 bg-blue-50 px-4 py-2 dark:border-blue-900 dark:bg-blue-950/30">
                  <span className="text-xs font-bold tracking-wider text-blue-600 uppercase dark:text-blue-400">
                    This Week · {row.label}
                  </span>
                </div>
                {weeklyHabits.map((habit) => (
                  <LogRow
                    key={habit._id}
                    periodLabel={habit.name}
                    value={sumForDates(habit._id, row.dates)}
                    target={habit.targetValue}
                    unit={habit.targetUnit}
                    isCurrentPeriod={true}
                    onQuickLog={() => addLog(habit._id, habit.targetValue, TODAY)}
                    onEdit={(newVal) => editLog(habit._id, TODAY, newVal)}
                  />
                ))}
              </div>
            );
          })}

          {/* PAST WEEKS section */}
          {WEEKLY_ROW_LABELS.slice(1).length > 0 && (
            <>
              <button
                onClick={() => setPastWeeksOpen((o) => !o)}
                className="hover:bg-neutral-150 flex w-full items-center gap-2 border-b border-neutral-200 bg-neutral-100 px-4 py-2 transition-colors dark:border-neutral-700 dark:bg-neutral-800/80 dark:hover:bg-neutral-800"
              >
                <span className="text-xs font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
                  Past weeks
                </span>
                <svg
                  className={`ml-auto h-4 w-4 text-neutral-400 transition-transform ${pastWeeksOpen ? 'rotate-180' : ''}`}
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M4 6l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {pastWeeksOpen && (
                <>
                  {(() => {
                    const pastRows = WEEKLY_ROW_LABELS.slice(1);
                    const totalPages = Math.ceil(pastRows.length / ITEMS_PER_PAGE);
                    const start = (pastWeeksPage - 1) * ITEMS_PER_PAGE;
                    const paginatedRows = pastRows.slice(start, start + ITEMS_PER_PAGE);

                    return (
                      <>
                        {paginatedRows.map((row) => {
                          const combinedValue = weeklyHabits.reduce((s, h) => s + sumForDates(h._id, row.dates), 0);
                          const combinedTarget = weeklyHabits.reduce((s, h) => s + h.targetValue, 0);
                          const isRowExpanded = expandedPastWeeks.has(row.weekKey);

                          return (
                            <PastPeriodRow
                              key={`past-week-${row.weekKey}`}
                              periodLabel={row.label}
                              value={combinedValue}
                              target={combinedTarget}
                              isExpanded={isRowExpanded}
                              onToggle={() => {
                                const newSet = new Set(expandedPastWeeks);
                                if (newSet.has(row.weekKey)) {
                                  newSet.delete(row.weekKey);
                                } else {
                                  newSet.add(row.weekKey);
                                }
                                setExpandedPastWeeks(newSet);
                              }}
                            >
                              {weeklyHabits.map((habit) => (
                                <HabitDetailRow
                                  key={`${row.weekKey}-${habit._id}`}
                                  habitName={habit.name}
                                  value={sumForDates(habit._id, row.dates)}
                                  target={habit.targetValue}
                                  unit={habit.targetUnit}
                                />
                              ))}
                            </PastPeriodRow>
                          );
                        })}

                        {/* Pagination for past weeks */}
                        <div className="border-t border-neutral-200 px-4 py-3 dark:border-neutral-700">
                          <Pagination>
                            <PaginationContent>
                              <PaginationItem>
                                <PaginationPrevious
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setPastWeeksPage((p) => Math.max(1, p - 1));
                                  }}
                                  className={pastWeeksPage === 1 ? 'pointer-events-none opacity-50' : ''}
                                />
                              </PaginationItem>
                              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                <PaginationItem key={pageNum}>
                                  <PaginationLink
                                    href="#"
                                    isActive={pageNum === pastWeeksPage}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setPastWeeksPage(pageNum);
                                    }}
                                  >
                                    {pageNum}
                                  </PaginationLink>
                                </PaginationItem>
                              ))}
                              <PaginationItem>
                                <PaginationNext
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setPastWeeksPage((p) => Math.min(totalPages, p + 1));
                                  }}
                                  className={pastWeeksPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                                />
                              </PaginationItem>
                            </PaginationContent>
                          </Pagination>
                        </div>
                      </>
                    );
                  })()}
                </>
              )}
            </>
          )}
        </HabitSection>

        <hr className="my-4 border-neutral-200 dark:border-neutral-700" />

        {/* ── MONTHLY SECTION ── */}
        <HabitSection title="Monthly" rangeLabel="Jan – May 2026" habits={monthlyHabits} barCellsMap={monthlyBarCells}>
          {/* THIS MONTH section */}
          {MONTHLY_ROW_LABELS.slice(0, 1).map((row) => {
            return (
              <div key={`this-month-section-${row.monthKey}`}>
                <div className="flex items-center gap-2 border-y-2 border-blue-200 bg-blue-50 px-4 py-2 dark:border-blue-900 dark:bg-blue-950/30">
                  <span className="text-xs font-bold tracking-wider text-blue-600 uppercase dark:text-blue-400">
                    This Month · {row.label}
                  </span>
                </div>
                {monthlyHabits.map((habit) => (
                  <LogRow
                    key={habit._id}
                    periodLabel={habit.name}
                    value={sumForMonth(habit._id, row.monthKey)}
                    target={habit.targetValue}
                    unit={habit.targetUnit}
                    isCurrentPeriod={true}
                    onQuickLog={() => addLog(habit._id, habit.targetValue, TODAY)}
                    onEdit={(newVal) => editLog(habit._id, TODAY, newVal)}
                  />
                ))}
              </div>
            );
          })}

          {/* PAST MONTHS section */}
          {MONTHLY_ROW_LABELS.slice(1).length > 0 && (
            <>
              <button
                onClick={() => setPastMonthsOpen((o) => !o)}
                className="hover:bg-neutral-150 flex w-full items-center gap-2 border-b border-neutral-200 bg-neutral-100 px-4 py-2 transition-colors dark:border-neutral-700 dark:bg-neutral-800/80 dark:hover:bg-neutral-800"
              >
                <span className="text-xs font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
                  Past months
                </span>
                <svg
                  className={`ml-auto h-4 w-4 text-neutral-400 transition-transform ${pastMonthsOpen ? 'rotate-180' : ''}`}
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M4 6l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {pastMonthsOpen && (
                <>
                  {(() => {
                    const pastRows = MONTHLY_ROW_LABELS.slice(1);
                    const totalPages = Math.ceil(pastRows.length / ITEMS_PER_PAGE);
                    const start = (pastMonthsPage - 1) * ITEMS_PER_PAGE;
                    const paginatedRows = pastRows.slice(start, start + ITEMS_PER_PAGE);

                    return (
                      <>
                        {paginatedRows.map((row) => {
                          const combinedValue = monthlyHabits.reduce((s, h) => s + sumForMonth(h._id, row.monthKey), 0);
                          const combinedTarget = monthlyHabits.reduce((s, h) => s + h.targetValue, 0);
                          const isRowExpanded = expandedPastMonths.has(row.monthKey);

                          return (
                            <PastPeriodRow
                              key={`past-month-${row.monthKey}`}
                              periodLabel={row.label}
                              value={combinedValue}
                              target={combinedTarget}
                              isExpanded={isRowExpanded}
                              onToggle={() => {
                                const newSet = new Set(expandedPastMonths);
                                if (newSet.has(row.monthKey)) {
                                  newSet.delete(row.monthKey);
                                } else {
                                  newSet.add(row.monthKey);
                                }
                                setExpandedPastMonths(newSet);
                              }}
                            >
                              {monthlyHabits.map((habit) => (
                                <HabitDetailRow
                                  key={`${row.monthKey}-${habit._id}`}
                                  habitName={habit.name}
                                  value={sumForMonth(habit._id, row.monthKey)}
                                  target={habit.targetValue}
                                  unit={habit.targetUnit}
                                />
                              ))}
                            </PastPeriodRow>
                          );
                        })}

                        {/* Pagination for past months */}
                        <div className="border-t border-neutral-200 px-4 py-3 dark:border-neutral-700">
                          <Pagination>
                            <PaginationContent>
                              <PaginationItem>
                                <PaginationPrevious
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setPastMonthsPage((p) => Math.max(1, p - 1));
                                  }}
                                  className={pastMonthsPage === 1 ? 'pointer-events-none opacity-50' : ''}
                                />
                              </PaginationItem>
                              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                <PaginationItem key={pageNum}>
                                  <PaginationLink
                                    href="#"
                                    isActive={pageNum === pastMonthsPage}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setPastMonthsPage(pageNum);
                                    }}
                                  >
                                    {pageNum}
                                  </PaginationLink>
                                </PaginationItem>
                              ))}
                              <PaginationItem>
                                <PaginationNext
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setPastMonthsPage((p) => Math.min(totalPages, p + 1));
                                  }}
                                  className={pastMonthsPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                                />
                              </PaginationItem>
                            </PaginationContent>
                          </Pagination>
                        </div>
                      </>
                    );
                  })()}
                </>
              )}
            </>
          )}
        </HabitSection>
      </div>
    </div>
>>>>>>> c0b67fc (Habit Tracking Page base)
  );
}
