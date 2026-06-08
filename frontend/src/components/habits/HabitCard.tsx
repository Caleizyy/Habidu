import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Habit } from '@/types/habit';
import HabitItemCard from './HabitItemCard';
import { Dispatch, SetStateAction } from 'react';
interface HabitCardProps {
  habits: Habit[];
  setRefreshKey: Dispatch<SetStateAction<number>>;
}

export default function HabitsCard({ habits, setRefreshKey }: Readonly<HabitCardProps>) {
  return (
    <Card className="h-full w-full">
      <div className="flex flex-row items-center justify-between px-6">
        <Input placeholder="Enter habit name" className="mt-2 h-[4vh] w-[25vw] min-w-40" />
      </div>
      <div className="mt-4 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-6 py-1">
        {habits.map((habit) => (
          <HabitItemCard key={habit._id} habit={habit} setRefreshKey={setRefreshKey} />
        ))}
      </div>
    </Card>
  );
}
