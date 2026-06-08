import HabitCard from '@/components/habits/HabitCard';
import { useState, useEffect } from 'react';
import { AddHabitDialog } from '@/components/habits/AddHabitDialog';
import { fetchHabits } from '@/api/habit';
import { Habit } from '@/types/habit';
import { PageLayout } from '@/components/layout/PageLayout';

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
    <PageLayout title="Habits" actions={<AddHabitDialog onHabitCreated={() => setRefreshKey((prev) => prev + 1)} />}>
      <div className="flex min-h-0 flex-1 flex-col gap-4 pb-12">
        <div className="flex min-h-0 flex-1 flex-col">
          {isLoading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!isLoading && !error && <HabitCard habits={habits} setRefreshKey={setRefreshKey} />}
        </div>
      </div>
    </PageLayout>
  );
}
