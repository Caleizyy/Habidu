import * as React from 'react';
import { Habit, PeriodCell } from './habit';

export interface HabitSectionProps {
  title: string;
  rangeLabel: string;
  habits: Habit[];
  barCellsMap: Record<string, PeriodCell[]>; // habitId -> cells for the bar
  children: React.ReactNode; // LogRows
  highlightIndex?: number; // Optional: column index to highlight instead of first (for daily section to highlight today)
}

export interface LogRowProps {
  periodLabel: string;
  periodSublabel?: string;
  value: number;
  target: number;
  unit: string;
  isCurrentPeriod?: boolean;
  // called when user taps "Log" — client sends quickLog:true, value:targetValue
  onQuickLog: () => void;
  // called when user manually edits — client sends quickLog:false, value:N
  onEdit: (value: number) => void;
  // called when user clicks "Undo" to delete the log entry
  onUndo: () => void;
}

export interface ProgressBarProps {
  cells: PeriodCell[];
  showLabels?: boolean; // if false, labels go in header instead
}

export interface HabitDetailRowProps {
  habitName: string;
  value: number;
  target: number;
  unit: string;
}

export interface PastPeriodRowHabit {
  value: number;
  target: number;
}

export interface PastPeriodRowProps {
  periodLabel: string;
  habits: PastPeriodRowHabit[];
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export interface PastPeriodsPaginationListProps<T> {
  items: T[];
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  isOpen: boolean;
}

export interface DailyHabitsSectionProps {
  habits: Habit[];
  barCellsMap: Record<string, PeriodCell[]>;
  rangeLabel: string;
  dailyRowLabels: Array<{ date: string; label: string; sublabel?: string }>;
  expandedDailyDate: string | null;
  setExpandedDailyDate: (date: string | null) => void;
  pastDaysOpen: boolean;
  setPastDaysOpen: (open: boolean) => void;
  pastDaysPage: number;
  setPastDaysPage: (page: number) => void;
  getDisplayValue: (habitId: string, date: string) => number;
  addLog: (habitId: string, value: number, date: string) => void;
  editLog: (habitId: string, date: string, value: number) => void;
  undoLog: (habitId: string, date: string) => void;
  dailyHighlightIndex: number;
}

export interface WeeklyHabitsSectionProps {
  habits: Habit[];
  barCellsMap: Record<string, PeriodCell[]>;
  rangeLabel: string;
  weeklyRowLabels: Array<{ weekKey: string; label: string; dates: string[] }>;
  expandedPastWeek: string | null;
  setExpandedPastWeek: (weekKey: string | null) => void;
  pastWeeksOpen: boolean;
  setPastWeeksOpen: (open: boolean) => void;
  pastWeeksPage: number;
  setPastWeeksPage: (page: number) => void;
  getDisplayValueForDates: (habitId: string, dates: string[]) => number;
  getDisplayValueForWeek: (habitId: string, dates: string[]) => number;
  addLog: (habitId: string, value: number, date: string) => void;
  editLog: (habitId: string, date: string, value: number) => void;
  undoLog: (habitId: string, date: string) => void;
  today: string;
}

export interface MonthlyHabitsSectionProps {
  habits: Habit[];
  barCellsMap: Record<string, PeriodCell[]>;
  rangeLabel: string;
  monthlyRowLabels: Array<{ monthKey: string; label: string }>;
  expandedPastMonth: string | null;
  setExpandedPastMonth: (monthKey: string | null) => void;
  pastMonthsOpen: boolean;
  setPastMonthsOpen: (open: boolean) => void;
  pastMonthsPage: number;
  setPastMonthsPage: (page: number) => void;
  getDisplayValueForMonth: (habitId: string, monthKey: string) => number;
  getDisplayValueForMonthKey: (habitId: string, monthKey: string) => number;
  addLog: (habitId: string, value: number, date: string) => void;
  editLog: (habitId: string, date: string, value: number) => void;
  undoLog: (habitId: string, date: string) => void;
  today: string;
}
