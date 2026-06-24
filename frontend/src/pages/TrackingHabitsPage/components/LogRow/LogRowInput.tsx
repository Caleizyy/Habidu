import { Input } from '@/components/ui/Input';

interface LogRowInputProps {
  draftValue: number;
  unit: string;
  onChange: (value: number) => void;
  onBlur: () => void;
}

const LogRowInput = ({ draftValue, unit, onChange, onBlur }: LogRowInputProps) => {
  return (
    <div className="flex items-center gap-1">
      <Input
        type="number"
        autoFocus
        value={draftValue}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        onBlur={onBlur}
        className="w-14 rounded border border-neutral-300 bg-white px-1.5 py-0.5 text-xs text-neutral-800 outline-none focus:border-green-500 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-200"
      />
      <span className="text-xs text-neutral-400 dark:text-neutral-500">{unit}</span>
    </div>
  );
};

export default LogRowInput;
