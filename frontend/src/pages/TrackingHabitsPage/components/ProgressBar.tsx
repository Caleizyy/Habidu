import { ProgressBarProps } from '@/types/tracking';

export function ProgressBar({ cells, showLabels = false }: ProgressBarProps) {
  return (
    <>
      {/* Labels header (only if showLabels is true) */}
      {showLabels && (
        <div className="mb-2 flex items-center gap-1">
          {cells.map((cell, i) => (
            <div key={i} className="flex-1 text-center">
              <span
                className="text-xs font-medium text-neutral-500 dark:text-neutral-400"
                style={{ fontFamily: 'monospace' }}
              >
                {cell.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Progress bars */}
      <div className="flex items-center gap-1">
        {cells.map((cell, i) => {
          const ratio = cell.target === 0 ? 0 : Math.min(cell.value / cell.target, 1);
          const completed = cell.value >= cell.target && cell.target > 0;
          const over = cell.value > cell.target;

          return (
            <div key={i} className="flex-1">
              {/* track — fills left to right */}
              <div
                className="w-full overflow-hidden rounded-sm bg-neutral-200 dark:bg-neutral-700"
                style={{ height: 10 }}
              >
                <div
                  className={`h-full rounded-sm transition-all duration-300 ${
                    over
                      ? 'bg-green-300 dark:bg-green-700'
                      : completed
                        ? 'bg-green-500 dark:bg-green-500'
                        : ratio > 0
                          ? 'bg-amber-300 dark:bg-amber-300'
                          : ''
                  }`}
                  style={{ width: `${ratio * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
