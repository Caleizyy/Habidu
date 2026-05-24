interface HabitDetailRowProps {
  habitName: string;
  value: number;
  target: number;
  unit: string;
}

export function HabitDetailRow({ habitName, value, target, unit }: HabitDetailRowProps) {
  const completed = value >= target && target > 0;
  const ratio = target === 0 ? 0 : Math.min(value / target, 1);

  return (
    <div className="flex items-center gap-3 border-b border-neutral-100 px-4 py-2 last:border-b-0 dark:border-neutral-800/50">
      <div className="w-32 shrink-0 text-xs text-neutral-600 dark:text-neutral-400">{habitName}</div>

      <div className="h-1 flex-1 overflow-hidden rounded-full bg-neutral-300 dark:bg-neutral-700">
        <div
          className={`h-full rounded-full transition-all ${
            completed ? 'bg-green-500' : 'bg-green-300 dark:bg-green-800'
          }`}
          style={{ width: `${ratio * 100}%` }}
        />
      </div>

      <span className="shrink-0 font-mono text-xs text-neutral-500 dark:text-neutral-400">
        {Math.round(value)}/{Math.round(target)} {unit}
      </span>
    </div>
  );
}
