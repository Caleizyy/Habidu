import * as React from 'react';
import { Habit, PeriodCell } from '@/types/habit';
import { HabitSection } from '../components';
import { LogRow } from '../components/LogRow/LogRow';

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
  const [openPopupKey, setOpenPopupKey] = React.useState<string | null>(null);

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
            {habits.map((habit) => {
              const popupKey = `${habit._id}-${row.date}`;
              return (
                <>
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
                    isPopupOpen={openPopupKey === popupKey}
                    onPopupToggle={() => setOpenPopupKey(openPopupKey === popupKey ? null : popupKey)}
                  />
                </>
              );
            })}
          </div>
        ))}
      </HabitSection>
    </>
  );
}
