import HabitCard from '@/components/habits/HabitCard';
import { useState, useEffect } from 'react';
import { fetchHabits } from '@/services/habitService';

export function HabitsPage() {
  const [habits, setHabits] = useState([]);
  useEffect(() => {
    fetchHabits().then((data) => setHabits(data));
  }, []);

  return (
    <div className="flex flex-1 flex-col">
      <h1 className="mt-12 ml-12 flex justify-start text-6xl text-black">Goals</h1>
      <div className="mb-4 ml-12 flex flex-1 flex-col justify-end">
        <div className="grid grid-cols-3 gap-16">
          <HabitCard label={'Timeliness'} choices={['Daily', 'Weekly', 'Monthly']} habits={habits} />
          <HabitCard label={'Category'} choices={['Sports', 'Study', 'Skills', 'Chores']} habits={habits} />
          <HabitCard label={'Placeholder'} choices={['Undecided', 'Another Placeholder']} habits={habits} />
        </div>
      </div>
    </div>
  );
}
