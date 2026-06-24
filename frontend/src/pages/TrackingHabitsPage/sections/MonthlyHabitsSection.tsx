import * as React from 'react';
import { Habit, PeriodCell } from '@/types/habit';
import { LogRow, HabitSection } from '../components';

export interface MonthlyHabitsSectionProps {
  habits: Habit[];
  barCellsMap: Record<string, PeriodCell[]>;
  rangeLabel: string;
  monthlyRowLabels: Array<{ monthKey: string; label: string }>;
  getDisplayValueForMonth: (habitId: string, monthKey: string) => number;
  addLog: (habitId: string, value: number, date: string) => void;
  editMonthlyLog: (habitId: string, monthKey: string, value: number) => void;
  undoMonthlyLog: (habitId: string, monthKey: string) => void;
  sectionStreak: number;
  sectionPersonalBest: number;
}

export function MonthlyHabitsSection({
  habits,
  barCellsMap,
  rangeLabel,
  monthlyRowLabels,
  getDisplayValueForMonth,
  editMonthlyLog,
  undoMonthlyLog,
  sectionStreak,
  sectionPersonalBest,
}: MonthlyHabitsSectionProps) {
  const [openPopupKey, setOpenPopupKey] = React.useState<string | null>(null);

  return (
    <>
      <HabitSection
        title="Monthly"
        rangeLabel={rangeLabel}
        habits={habits}
        barCellsMap={barCellsMap}
        sectionStreak={sectionStreak}
        sectionPersonalBest={sectionPersonalBest}
      >
        {/* THIS MONTH section */}
        {monthlyRowLabels.slice(0, 1).map((row) => (
          <div key={`this-month-section-${row.monthKey}`}>
            <div className="flex items-center gap-2 border-y-2 border-blue-200 bg-blue-50 px-4 py-2 dark:border-blue-900 dark:bg-blue-950/30">
              <span className="text-xs font-bold tracking-wider text-blue-600 uppercase dark:text-blue-400">
                This Month · {row.label}
              </span>
            </div>
            {habits.map((habit) => {
              const popupKey = `${habit._id}-${row.monthKey}`;
              return (
                <LogRow
                  key={habit._id}
                  periodLabel={habit.name}
                  value={getDisplayValueForMonth(habit._id, row.monthKey)}
                  target={habit.targetValue}
                  unit={habit.targetUnit}
                  isCurrentPeriod={true}
                  currentStreak={habit.currentStreak || 0}
                  personalBest={habit.personalBest || 0}
                  onQuickLog={() => editMonthlyLog(habit._id, row.monthKey, habit.targetValue)}
                  onEdit={(newVal) => editMonthlyLog(habit._id, row.monthKey, newVal)}
                  onUndo={() => undoMonthlyLog(habit._id, row.monthKey)}
                  isPopupOpen={openPopupKey === popupKey}
                  onPopupToggle={() => setOpenPopupKey(openPopupKey === popupKey ? null : popupKey)}
                />
              );
            })}
          </div>
        ))}
      </HabitSection>
    </>
  );
}
