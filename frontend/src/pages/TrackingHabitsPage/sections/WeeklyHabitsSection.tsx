import * as React from 'react';
import { Habit, PeriodCell } from '@/types/habit';
import { PastPeriodRow, LogRow, HabitSection, PastPeriodsPaginationList } from '../components';
import { HABIT_TRACKING_CONSTANTS } from '@/constants/HabitTracking.constants';

export interface WeeklyHabitsSectionProps {
  habits: Habit[];
  barCellsMap: Record<string, PeriodCell[]>;
  rangeLabel: string;
  weeklyRowLabels: Array<{ weekKey: string; label: string; dates: string[] }>;
  getDisplayValueForDates: (habitId: string, dates: string[]) => number;
  getDisplayValueForWeek: (habitId: string, dates: string[]) => number;
  addLog: (habitId: string, value: number, date: string) => void;
  editWeeklyLog: (habitId: string, dates: string[], value: number) => void;
  undoWeeklyLog: (habitId: string, dates: string[]) => void;
  sectionStreak: number;
  sectionPersonalBest: number;
}

export function WeeklyHabitsSection({
  habits,
  barCellsMap,
  rangeLabel,
  weeklyRowLabels,
  getDisplayValueForDates,
  getDisplayValueForWeek,
  editWeeklyLog,
  undoWeeklyLog,
  sectionStreak,
  sectionPersonalBest,
}: WeeklyHabitsSectionProps) {
  const ITEMS_PER_PAGE = HABIT_TRACKING_CONSTANTS.ITEMS_PER_PAGE;
  const [expandedPastWeek, setExpandedPastWeek] = React.useState<string | null>(null);
  const [pastWeeksOpen, setPastWeeksOpen] = React.useState(false);
  const [pastWeeksPage, setPastWeeksPage] = React.useState(1);

  return (
    <>
      <HabitSection
        title="Weekly"
        rangeLabel={rangeLabel}
        habits={habits}
        barCellsMap={barCellsMap}
        sectionStreak={sectionStreak}
        sectionPersonalBest={sectionPersonalBest}
      >
        {/* THIS WEEK section */}
        {weeklyRowLabels.slice(0, 1).map((row) => (
          <div key={`this-week-section-${row.weekKey}`}>
            <div className="flex items-center gap-2 border-y-2 border-blue-200 bg-blue-50 px-4 py-2 dark:border-blue-900 dark:bg-blue-950/30">
              <span className="text-xs font-bold tracking-wider text-blue-600 uppercase dark:text-blue-400">
                This Week · {row.label}
              </span>
            </div>
            {habits.map((habit) => (
              <LogRow
                key={habit._id}
                periodLabel={habit.name}
                value={getDisplayValueForDates(habit._id, row.dates)}
                target={habit.targetValue}
                unit={habit.targetUnit}
                isCurrentPeriod={true}
                currentStreak={habit.currentStreak || 0}
                personalBest={habit.personalBest || 0}
                onQuickLog={() => editWeeklyLog(habit._id, row.dates, habit.targetValue)}
                onEdit={(newVal) => editWeeklyLog(habit._id, row.dates, newVal)}
                onUndo={() => undoWeeklyLog(habit._id, row.dates)}
              />
            ))}
          </div>
        ))}

        {/* PAST WEEKS section */}
        {weeklyRowLabels.slice(1).length > 0 && (
          <>
            <button
              onClick={() => {
                setPastWeeksOpen(!pastWeeksOpen);
                setPastWeeksPage(1); // Reset to first page when toggling
              }}
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
            <PastPeriodsPaginationList
              items={weeklyRowLabels.slice(1)}
              itemsPerPage={ITEMS_PER_PAGE}
              currentPage={pastWeeksPage}
              onPageChange={setPastWeeksPage}
              isOpen={pastWeeksOpen}
              renderItem={(row) => {
                const isRowExpanded = expandedPastWeek === row.weekKey;

                return (
                  <PastPeriodRow
                    key={`past-week-${row.weekKey}`}
                    periodLabel={row.label}
                    habits={habits.map((habit) => ({
                      value: getDisplayValueForWeek(habit._id, row.dates),
                      target: habit.targetValue,
                    }))}
                    isExpanded={isRowExpanded}
                    onToggle={() => {
                      setExpandedPastWeek(isRowExpanded ? null : row.weekKey);
                    }}
                  >
                    {habits.map((habit) => (
                      <LogRow
                        key={`${row.weekKey}-${habit._id}`}
                        periodLabel={habit.name}
                        value={getDisplayValueForWeek(habit._id, row.dates)}
                        target={habit.targetValue}
                        unit={habit.targetUnit}
                        isCurrentPeriod={false}
                        currentStreak={habit.currentStreak || 0}
                        personalBest={habit.personalBest || 0}
                        onQuickLog={() => editWeeklyLog(habit._id, row.dates, habit.targetValue)}
                        onEdit={(newVal) => editWeeklyLog(habit._id, row.dates, newVal)}
                        onUndo={() => undoWeeklyLog(habit._id, row.dates)}
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
