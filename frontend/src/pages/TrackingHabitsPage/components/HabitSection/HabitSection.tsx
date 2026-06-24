import * as React from 'react';
import { Habit, PeriodCell } from '@/types/habit';
import SectionHeader from './SectionHeader';
import HabitBarsGrid from './HabitBarsGrid';

export interface HabitSectionProps {
  title: string;
  rangeLabel: string;
  habits: Habit[];
  barCellsMap: Record<string, PeriodCell[]>; // habitId -> cells for the bar
  children: React.ReactNode; // LogRows
  highlightIndex?: number;
  sectionStreak?: number;
  sectionPersonalBest?: number;
}

const HabitSection = ({
  title,
  rangeLabel,
  habits,
  barCellsMap,
  children,
  highlightIndex = 0,
  sectionStreak = 0,
  sectionPersonalBest = 0,
}: HabitSectionProps) => {
  const [open, setOpen] = React.useState(true);

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800">
      <SectionHeader
        title={title}
        rangeLabel={rangeLabel}
        open={open}
        onToggle={() => setOpen((o) => !o)}
        sectionStreak={sectionStreak}
        sectionPersonalBest={sectionPersonalBest}
      />

      <div className={`overflow-hidden transition-all duration-500 ${open ? 'max-h-screen' : 'max-h-0'}`}>
        <HabitBarsGrid habits={habits} barCellsMap={barCellsMap} highlightIndex={highlightIndex} />

        {/* Log rows */}
        <div>{children}</div>
      </div>
    </div>
  );
};

export { HabitSection };
