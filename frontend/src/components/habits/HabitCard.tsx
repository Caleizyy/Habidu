import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Habit } from '@/types/habit';
import HabitItemCard from './HabitItemCard';
import { Dispatch, SetStateAction, useState } from 'react';
import { Group } from '@/types/group';

interface HabitCardProps {
  habits: Habit[];
  setRefreshKey?: Dispatch<SetStateAction<number>>;
  groups?: Group[];
}

export default function HabitsCard({ habits, groups = [] }: Readonly<HabitCardProps>) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = habits.filter((habit) => habit.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <Card className="h-full w-full">
      <div className="flex flex-row items-center justify-between px-6">
        <Input
          placeholder="Enter habit name"
          className="mt-2 h-[4vh] w-[25vw] min-w-40"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="mt-4 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-6 py-1">
        {filtered.map((habit) => {
          const group = groups.find((g) => g._id === habit.groupId);
          return <HabitItemCard key={habit._id} habit={habit} groupName={group?.name} />;
        })}
      </div>
    </Card>
  );
}
