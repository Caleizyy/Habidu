import { Habit, PeriodCell } from '@/types/habit';
import { LogRow, HabitSection } from '../components';

export interface WeeklyHabitsSectionProps {
  habits: Habit[];
  barCellsMap: Record<string, PeriodCell[]>;
  rangeLabel: string;
  weeklyRowLabels: Array<{ weekKey: string; label: string; dates: string[] }>;
  getDisplayValueForDates: (habitId: string, dates: string[]) => number;
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
  editWeeklyLog,
  undoWeeklyLog,
  sectionStreak,
  sectionPersonalBest,
}: WeeklyHabitsSectionProps) {
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
            {habits.map((habit) => {
              return (
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
              );
            })}
          </div>
        ))}
      </HabitSection>
    </>
  );
}
