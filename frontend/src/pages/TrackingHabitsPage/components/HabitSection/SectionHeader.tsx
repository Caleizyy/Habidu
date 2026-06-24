import { SectionStreakDisplay } from './SectionStreakDisplay';

export interface SectionHeaderProps {
  title: string;
  rangeLabel: string;
  open: boolean;
  onToggle: () => void;
  sectionStreak: number;
  sectionPersonalBest: number;
}

export function SectionHeader({
  title,
  rangeLabel,
  open,
  onToggle,
  sectionStreak,
  sectionPersonalBest,
}: SectionHeaderProps) {
  return (
    <button
      onClick={onToggle}
      className="flex w-full items-center gap-3 border-b border-neutral-200 bg-white px-4 py-2 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800/80"
    >
      <span className="text-sm font-bold tracking-wide text-neutral-800 uppercase dark:text-neutral-100">{title}</span>
      <span className="text-xs font-normal text-neutral-400 dark:text-neutral-500">{rangeLabel}</span>

      <div className="ml-auto flex-shrink-0">
        <SectionStreakDisplay currentStreak={sectionStreak} personalBest={sectionPersonalBest} />
      </div>

      <svg
        className={`h-4 w-4 flex-shrink-0 text-neutral-400 transition-transform ${open ? 'rotate-180' : ''}`}
        viewBox="0 0 16 16"
        fill="none"
      >
        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
