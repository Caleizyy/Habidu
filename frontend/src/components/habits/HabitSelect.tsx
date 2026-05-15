import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';

interface HabitSelectProps {
  label: string;
  choices: string[];
}

export function HabitSelect({ label, choices }: HabitSelectProps) {
  return (
    <div className="ml-4 flex">
      <Select>
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
