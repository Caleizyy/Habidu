import HabitCard from '@/components/habits/HabitCard';
import { AddHabitDialog } from '@/components/habits/AddHabitDialog';
import { PageLayout } from '@/components/layout/PageLayout';
import { useHabitsQuery } from '@/pages/TrackingHabitsPage/hooks/useHabitsQuery';

export function HabitsPage() {
  const { status, data, error } = useHabitsQuery();

  return (
    <PageLayout title="Habits" actions={<AddHabitDialog />}>
      <div className="flex min-h-0 flex-1 flex-col gap-4 pb-12">
        <div className="flex min-h-0 flex-1 flex-col">
          {status === 'pending' && <p>Loading...</p>}
          {status === 'error' && <p className="text-red-500">{error.message}</p>}
          {status !== 'pending' && status !== 'error' && <HabitCard habits={data} />}
        </div>
      </div>
    </PageLayout>
  );
}
