import * as React from 'react';
import { Habit, PeriodCell } from '@/types/habit';
import { PastPeriodRow, LogRow, HabitSection, PastPeriodsPaginationList } from '../components';
import { HABIT_TRACKING_CONSTANTS } from '@/constants/HabitTracking.constants';

export interface DailyHabitsSectionProps {
  habits: Habit[];
  barCellsMap: Record<string, PeriodCell[]>;
  rangeLabel: string;
  dailyRowLabels: Array<{ date: string; label: string; sublabel?: string }>;
  getDisplayValue: (habitId: string, date: string) => number;
  addLog: (habitId: string, value: number, date: string) => void;
  editLog: (habitId: string, date: string, value: number) => void;
  undoLog: (habitId: string, date: string) => void;
  dailyHighlightIndex: number;
  sectionStreak: number;
  sectionPersonalBest: number;
}

export function DailyHabitsSection({
  habits,
  barCellsMap,
  rangeLabel,
  dailyRowLabels,
  getDisplayValue,
  addLog,
  editLog,
  undoLog,
  dailyHighlightIndex,
  sectionStreak,
  sectionPersonalBest,
}: DailyHabitsSectionProps) {
  const ITEMS_PER_PAGE = HABIT_TRACKING_CONSTANTS.ITEMS_PER_PAGE;
  const [expandedDailyDate, setExpandedDailyDate] = React.useState<string | null>(null);
  const [pastDaysOpen, setPastDaysOpen] = React.useState(false);
  const [pastDaysPage, setPastDaysPage] = React.useState(1);

  return (
    <>
      <HabitSection
        title="Daily"
        rangeLabel={rangeLabel}
        habits={habits}
        barCellsMap={barCellsMap}
        highlightIndex={dailyHighlightIndex}
        sectionStreak={sectionStreak}
        sectionPersonalBest={sectionPersonalBest}
      >
        {/* TODAY section */}
        {dailyRowLabels.slice(-1).map((row) => (
          <div key={`today-section-${row.date}`}>
            <div className="flex items-center gap-2 border-y-2 border-blue-200 bg-blue-50 px-4 py-2 dark:border-blue-900 dark:bg-blue-950/30">
              <span className="text-xs font-bold tracking-wider text-blue-600 uppercase dark:text-blue-400">
                Today · {row.label}
              </span>
            </div>
            {habits.map((habit) => (
              <LogRow
                key={habit._id}
                periodLabel={habit.name}
                value={getDisplayValue(habit._id, row.date)}
                target={habit.targetValue}
                unit={habit.targetUnit}
                isCurrentPeriod={true}
                currentStreak={habit.currentStreak || 0}
                personalBest={habit.personalBest || 0}
                onQuickLog={() => addLog(habit._id, habit.targetValue, row.date)}
                onEdit={(newVal) => editLog(habit._id, row.date, newVal)}
                onUndo={() => undoLog(habit._id, row.date)}
              />
            ))}
          </div>
        ))}

        {/* PAST section */}
        {dailyRowLabels.slice(0, -1).length > 0 && (
          <>
            <button
              onClick={() => {
                setPastDaysOpen(!pastDaysOpen);
                setPastDaysPage(1); // Reset to first page when toggling
              }}
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
            <PastPeriodsPaginationList
              items={dailyRowLabels.slice(0, -1).reverse()}
              itemsPerPage={ITEMS_PER_PAGE}
              currentPage={pastDaysPage}
              onPageChange={setPastDaysPage}
              isOpen={pastDaysOpen}
              renderItem={(row) => {
                const isRowExpanded = expandedDailyDate === row.date;
                const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(row.date).getDay()];

                return (
                  <PastPeriodRow
                    key={row.date}
                    periodLabel={`${dayOfWeek} · ${row.label}`}
                    habits={habits.map((habit) => ({
                      value: getDisplayValue(habit._id, row.date),
                      target: habit.targetValue,
                    }))}
                    isExpanded={isRowExpanded}
                    onToggle={() => {
                      setExpandedDailyDate(isRowExpanded ? null : row.date);
                    }}
                  >
                    {habits.map((habit) => (
                      <LogRow
                        key={habit._id}
                        periodLabel={habit.name}
                        value={getDisplayValue(habit._id, row.date)}
                        target={habit.targetValue}
                        unit={habit.targetUnit}
                        isCurrentPeriod={false}
                        currentStreak={habit.currentStreak || 0}
                        personalBest={habit.personalBest || 0}
                        onQuickLog={() => addLog(habit._id, habit.targetValue, row.date)}
                        onEdit={(newVal) => editLog(habit._id, row.date, newVal)}
                        onUndo={() => undoLog(habit._id, row.date)}
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
