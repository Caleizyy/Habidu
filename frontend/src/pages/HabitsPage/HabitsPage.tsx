import HabitCard from '@/components/habits/HabitCard';
import { useState, useEffect } from 'react';
import { AddHabitDialog } from '@/components/habits/AddHabitDialog';
import { fetchHabits } from '@/api/habit';
import { Habit } from '@/types/habit';

export function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    fetchHabits()
      .then((data) => setHabits(data))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [refreshKey]);

  return (
    <div className="flex h-screen flex-1 flex-col">
      <div className="flex flex-row items-center justify-between">
        <h1 className="mt-12 ml-12 flex justify-start text-6xl text-black">Goals</h1>
        <AddHabitDialog onHabitCreated={() => setRefreshKey((prev) => prev + 1)} />
      </div>
      <div className="mt-12 ml-12 h-[70vh] w-[90vw]">
        <div className="h-full">
          {isLoading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!isLoading && !error && <HabitCard habits={habits} />}
        </div>
      </div>
    </div>
  );
}
