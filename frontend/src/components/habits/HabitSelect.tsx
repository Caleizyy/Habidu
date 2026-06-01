import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';

interface HabitSelectProps {
  label: string;
  choices: string[];
  value?: string;
  onValueChange?: (value: string) => void;
}

export function HabitSelect({ label, choices, value, onValueChange }: HabitSelectProps) {
  return (
    <div className="ml-4 flex">
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-50">
          <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {choices.map((choice) => (
              <SelectItem key={choice} value={choice}>
                {' '}
                {choice}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
