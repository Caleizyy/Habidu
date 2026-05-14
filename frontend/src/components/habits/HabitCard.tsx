import { Card } from '@/components/ui/Card';
import { HabitSelect } from './HabitSelect';
import { AddHabitDialog } from './AddHabitDialog';

interface HabitCardProps {
  label: string;
  choices: string[];
}

export default function HabitCard({ label, choices }: HabitCardProps) {
  return (
    <Card className="h-130 w-93">
      <div className="flex flex-row items-center justify-between">
        <HabitSelect label={label} choices={choices} />
        <AddHabitDialog />
      </div>
    </Card>
  );
}
