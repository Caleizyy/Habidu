import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Habit } from '@/types/habit';
import HabitItemCard from './HabitItemCard';
interface HabitCardProps {
  habits: Habit[];
}

export default function HabitsCard({ habits }: HabitCardProps) {
  return (
    <Card className="h-full w-full">
      <div className="flex flex-row items-center justify-between">
        <Input placeholder="Enter habit name" className="mt-2 ml-6 h-[4vh] w-[25vw]" />
      </div>
      <div className="mt-4 flex h-[70vh] flex-col gap-4 overflow-y-auto">
        {habits.map((habit) => (
          <HabitItemCard key={habit.id} habit={habit} />
        ))}
      </div>
    </Card>
  );
}
