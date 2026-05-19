import { Card } from '@/components/ui/Card';
import { HabitSelect } from './HabitSelect';
import { AddHabitDialog } from './AddHabitDialog';

interface Habit {
  _id: string;
  name: string;
  frequency: string;
  difficulty: string;
  category: string;
  notes?: string;
}
interface HabitCardProps {
  label: string;
  choices: string[];
  habits: Habit[];
}

export default function HabitCard({ label, choices, habits }: HabitCardProps) {
  return (
    <Card className="h-130 w-93">
      <div className="flex flex-row items-center justify-between">
        <HabitSelect label={label} choices={choices} />
        <AddHabitDialog />
      </div>
      {habits.map((habit) => (
        <p key={habit._id}>{habit.name}</p>
      ))}
    </Card>
  );
}
