interface Props {
  name: string;
  frequency: string;
  targetValue: number;
  targetUnit: string;
  grandTotal: number;
}

export function HabitHeader({ name, frequency, targetValue, targetUnit, grandTotal }: Props) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <div>
        <h3 className="font-semibold">{name}</h3>
        <p className="text-xs text-neutral-500">
          {frequency} · Target: {targetValue} {targetUnit}
        </p>
      </div>
      <span className="text-sm font-medium tabular-nums">
        {grandTotal} / {targetValue} {targetUnit}
      </span>
    </div>
  );
}
