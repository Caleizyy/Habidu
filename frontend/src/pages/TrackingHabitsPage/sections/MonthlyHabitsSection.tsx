import * as React from 'react';
import { Habit, PeriodCell } from '@/types/habit';
import { PastPeriodRow, LogRow, HabitSection, PastPeriodsPaginationList } from '../components';
import { HABIT_TRACKING_CONSTANTS } from '@/constants/HabitTracking.constants';
import { getTodayDate } from '@/utils/dateHelpers';

export interface MonthlyHabitsSectionProps {
  habits: Habit[];
  barCellsMap: Record<string, PeriodCell[]>;
  rangeLabel: string;
  monthlyRowLabels: Array<{ monthKey: string; label: string }>;
  getDisplayValueForMonth: (habitId: string, monthKey: string) => number;
  getDisplayValueForMonthKey: (habitId: string, monthKey: string) => number;
  addLog: (habitId: string, value: number, date: string) => void;
  editMonthlyLog: (habitId: string, monthKey: string, value: number) => void;
  undoMonthlyLog: (habitId: string, monthKey: string) => void;
}

export function MonthlyHabitsSection({
  habits,
  barCellsMap,
  rangeLabel,
  monthlyRowLabels,
  getDisplayValueForMonth,
  getDisplayValueForMonthKey,
  addLog,
  editMonthlyLog,
  undoMonthlyLog,
}: MonthlyHabitsSectionProps) {
  const ITEMS_PER_PAGE = HABIT_TRACKING_CONSTANTS.ITEMS_PER_PAGE;
  const today = getTodayDate();
  const [expandedPastMonth, setExpandedPastMonth] = React.useState<string | null>(null);
  const [pastMonthsOpen, setPastMonthsOpen] = React.useState(false);
  const [pastMonthsPage, setPastMonthsPage] = React.useState(1);

  return (
    <>
      <HabitSection
        title="Monthly"
        rangeLabel={rangeLabel}
        habits={habits}
        barCellsMap={barCellsMap}
        sectionStreak={0}
        sectionPersonalBest={0}
      >
        {/* THIS MONTH section */}
        {monthlyRowLabels.slice(0, 1).map((row) => (
          <div key={`this-month-section-${row.monthKey}`}>
            <div className="flex items-center gap-2 border-y-2 border-blue-200 bg-blue-50 px-4 py-2 dark:border-blue-900 dark:bg-blue-950/30">
              <span className="text-xs font-bold tracking-wider text-blue-600 uppercase dark:text-blue-400">
                This Month · {row.label}
              </span>
            </div>
            {habits.map((habit) => (
              <LogRow
                key={habit._id}
                periodLabel={habit.name}
                value={getDisplayValueForMonth(habit._id, row.monthKey)}
                target={habit.targetValue}
                unit={habit.targetUnit}
                isCurrentPeriod={true}
<<<<<<< HEAD
                onQuickLog={() => editMonthlyLog(habit._id, row.monthKey, habit.targetValue)}
=======
                currentStreak={habit.currentStreak || 0}
                personalBest={habit.personalBest || 0}
                onQuickLog={() => addLog(habit._id, habit.targetValue, today)}
>>>>>>> 753ccd9 (added streak/personal best frontend(hardcoded values))
                onEdit={(newVal) => editMonthlyLog(habit._id, row.monthKey, newVal)}
                onUndo={() => undoMonthlyLog(habit._id, row.monthKey)}
              />
            ))}
          </div>
        ))}

        {/* PAST MONTHS section */}
        {monthlyRowLabels.slice(1).length > 0 && (
          <>
            <button
              onClick={() => {
                setPastMonthsOpen(!pastMonthsOpen);
                setPastMonthsPage(1); // Reset to first page when toggling
              }}
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
            <PastPeriodsPaginationList
              items={monthlyRowLabels.slice(1)}
              itemsPerPage={ITEMS_PER_PAGE}
              currentPage={pastMonthsPage}
              onPageChange={setPastMonthsPage}
              isOpen={pastMonthsOpen}
              renderItem={(row) => {
                const isRowExpanded = expandedPastMonth === row.monthKey;

                return (
                  <PastPeriodRow
                    key={`past-month-${row.monthKey}`}
                    periodLabel={row.label}
                    habits={habits.map((habit) => ({
                      value: getDisplayValueForMonthKey(habit._id, row.monthKey),
                      target: habit.targetValue,
                    }))}
                    isExpanded={isRowExpanded}
                    onToggle={() => {
                      setExpandedPastMonth(isRowExpanded ? null : row.monthKey);
                    }}
                  >
                    {habits.map((habit) => (
                      <LogRow
                        key={`${row.monthKey}-${habit._id}`}
                        periodLabel={habit.name}
                        value={getDisplayValueForMonthKey(habit._id, row.monthKey)}
                        target={habit.targetValue}
                        unit={habit.targetUnit}
                        isCurrentPeriod={false}
                        currentStreak={habit.currentStreak || 0}
                        personalBest={habit.personalBest || 0}
                        onQuickLog={() => editMonthlyLog(habit._id, row.monthKey, habit.targetValue)}
                        onEdit={(newVal) => editMonthlyLog(habit._id, row.monthKey, newVal)}
                        onUndo={() => undoMonthlyLog(habit._id, row.monthKey)}
                      />
                    ))}
                  </PastPeriodRow>
                );
              }}
            />
          </>
        )}
      </HabitSection>
    </>
  );
}
