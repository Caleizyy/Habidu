import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

interface Habit {
  _id: string;
  name: string;
  frequency: string;
  difficulty: string;
  category: string;
  notes?: string;
}
interface HabitCardProps {
  habits: Habit[];
}

export default function HabitCard({ habits }: HabitCardProps) {
  return (
    <Card className="h-full w-full">
      <div className="flex flex-row items-center justify-between">
        <Input placeholder="Enter habit name" className="mt-2 ml-6 h-[5vh] w-[25vw]" />
      </div>
      {habits.map((habit) => (
        <p key={habit._id}>{habit.name}</p>
      ))}
    </Card>
  );
}
