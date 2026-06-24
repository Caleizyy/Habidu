interface LogRowStatusProps {
  isCompleted: boolean;
  isCurrentPeriod?: boolean;
  ratio: number;
}

const LogRowStatus = ({ isCompleted, isCurrentPeriod, ratio }: LogRowStatusProps) => {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full transition-all ${
        isCompleted
          ? 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400'
          : 'bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500'
      } ${isCurrentPeriod ? 'h-9 w-9' : 'h-7 w-7'}`}
    >
      {isCompleted ? (
        <svg className={isCurrentPeriod ? 'h-5 w-5' : 'h-4 w-4'} viewBox="0 0 16 16" fill="none">
          <path
            d="M3 8l3.5 3.5L13 5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <span style={{ fontSize: isCurrentPeriod ? 10 : 9, fontFamily: 'monospace', fontWeight: 600 }}>
          {Math.round(ratio * 100)}%
        </span>
      )}
    </div>
  );
};

export default LogRowStatus;
