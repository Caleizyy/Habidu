import { PeriodCell } from '@/types/habit';

export interface PeriodColumnHeadersProps {
  cells: PeriodCell[];
  highlightIndex: number;
}

const PeriodColumnHeaders = ({ cells, highlightIndex }: PeriodColumnHeadersProps) => {
  return (
    <div className="flex items-start gap-3 p-4 pb-2">
      <div className="w-44 shrink-0 text-sm text-neutral-700 dark:text-neutral-300" />
      <div className="flex-1">
        <div className="flex gap-1">
          {cells.map((cell, i) => (
            <div
              key={i}
              className={`flex-1 rounded-md px-1 py-0.5 text-center ${i === highlightIndex ? 'bg-blue-100 dark:bg-blue-950/50' : ''}`}
            >
              <span
                className={`text-xs font-semibold ${i === highlightIndex ? 'text-blue-700 dark:text-blue-300' : 'text-neutral-600 dark:text-neutral-400'}`}
                style={{ fontFamily: 'monospace' }}
              >
                {cell.label}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="w-24" />
    </div>
  );
};

export default PeriodColumnHeaders;
