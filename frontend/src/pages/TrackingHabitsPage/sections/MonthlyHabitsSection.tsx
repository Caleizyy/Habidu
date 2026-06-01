import { Habit, PeriodCell } from '@/types/habit';
import { PastPeriodRow, LogRow, HabitSection, PastPeriodsPaginationList } from '../components';
import { HABIT_TRACKING_CONSTANTS } from '@/constants/HabitTracking.constants';

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

export function MonthlyHabitsSection({
  habits,
  barCellsMap,
  rangeLabel,
  monthlyRowLabels,
  expandedPastMonth,
  setExpandedPastMonth,
  pastMonthsOpen,
  setPastMonthsOpen,
  pastMonthsPage,
  setPastMonthsPage,
  getDisplayValueForMonth,
  getDisplayValueForMonthKey,
  addLog,
  editLog,
  undoLog,
  today,
}: MonthlyHabitsSectionProps) {
  const ITEMS_PER_PAGE = HABIT_TRACKING_CONSTANTS.ITEMS_PER_PAGE;

  return (
    <>
      <HabitSection title="Monthly" rangeLabel={rangeLabel} habits={habits} barCellsMap={barCellsMap}>
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
                onQuickLog={() => addLog(habit._id, habit.targetValue, today)}
                onEdit={(newVal) => editLog(habit._id, today, newVal)}
                onUndo={() => undoLog(habit._id, today)}
              />
            ))}
          </div>
        ))}

        {/* PAST MONTHS section */}
        {monthlyRowLabels.slice(1).length > 0 && (
          <>
            <button
              onClick={() => setPastMonthsOpen(!pastMonthsOpen)}
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
                        onQuickLog={() => addLog(habit._id, habit.targetValue, `${row.monthKey}-01`)}
                        onEdit={(newVal) => editLog(habit._id, `${row.monthKey}-01`, newVal)}
                        onUndo={() => undoLog(habit._id, `${row.monthKey}-01`)}
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
