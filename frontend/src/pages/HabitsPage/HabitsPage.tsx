import HabitCard from '@/components/habits/HabitCard';
import { useState, useEffect } from 'react';
import { fetchHabits } from '@/services/habitService';
import { AddHabitDialog } from '@/components/habits/AddHabitDialog';

export function HabitsPage() {
  const [habits, setHabits] = useState([]);
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    fetchHabits().then((data) => setHabits(data));
  }, [refresh]);

  return (
    <div className="flex h-screen flex-1 flex-col">
      <h1 className="mt-12 ml-12 flex justify-start text-6xl text-black">Goals</h1>
      <AddHabitDialog onHabitCreated={() => setRefresh((prev) => prev + 1)} />
      <div className="mt-12 ml-12 h-[60vh] w-[90vw]">
        <div className="h-full">
          <HabitCard habits={habits} />
        </div>
      </div>
    </div>
  );
}
