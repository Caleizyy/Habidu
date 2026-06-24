interface LogRowPeriodLabelProps {
  periodLabel: string;
  periodSublabel?: string;
  isCurrentPeriod?: boolean;
}

const LogRowPeriodLabel = ({ periodLabel, periodSublabel, isCurrentPeriod }: LogRowPeriodLabelProps) => {
  return (
    <div className="flex w-28 shrink-0 flex-col gap-0.5">
      <span
        className={`truncate font-semibold text-neutral-800 dark:text-neutral-200 ${isCurrentPeriod ? 'text-base' : 'text-sm'}`}
      >
        {periodLabel}
      </span>
      {periodSublabel && (
        <span className="truncate text-xs text-neutral-400 dark:text-neutral-500">{periodSublabel}</span>
      )}
    </div>
  );
};

export default LogRowPeriodLabel;
