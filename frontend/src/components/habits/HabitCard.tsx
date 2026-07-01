import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Habit } from '@/types/habit';
import HabitItemCard from './HabitItemCard';
import { Dispatch, SetStateAction, useState } from 'react';
import { Group } from '@/types/group';
import suitcase from '@/assets/suitcase.png';

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
      {habits.length === 0 && (
        <div className="text-center">
          <img src={suitcase} className="mx-auto flex size-30"></img>
          <p className="mb-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">No habits yet..</p>
        </div>
      )}
      {habits.length > 0 && filtered.length === 0 && (
        <div className="text-center">
          <img src={suitcase} className="mx-auto flex size-30"></img>
          <p className="mb-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            No habits with that name..
          </p>
        </div>
      )}
      <div className="mt-4 grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-y-auto px-6 py-1 md:grid-cols-2">
        {filtered.map((habit) => {
          const group = groups.find((g) => g._id === habit.groupId);
          return <HabitItemCard key={habit._id} habit={habit} groupName={group?.name} />;
        })}
      </div>
    </Card>
  );
}
