import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Habit } from '@/types/habit';
import HabitItemCard from './HabitItemCard';
import { Dispatch, SetStateAction, useState } from 'react';

interface HabitCardProps {
  habits: Habit[];
  setRefreshKey: Dispatch<SetStateAction<number>>;
}

export default function HabitsCard({ habits }: Readonly<HabitCardProps>) {
  const [searchTerm, setSearchTerm] = useState('');
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Card className="h-full w-full">
      <div className="flex flex-row items-center justify-between px-6">
        <Input placeholder="Enter habit name" className="mt-2 h-[4vh] w-[25vw] min-w-40" onChange={handleChange} />
      </div>
      <div className="mt-4 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-6 py-1">
        {habits
          .filter((habit) => habit.name.toLowerCase().includes(searchTerm))
          .map((habit) => (
            <HabitItemCard key={habit._id} habit={habit} />
          ))}
      </div>
    </Card>
  );
}
