import HabitCard from '@/components/habits/HabitCard';
import { AddHabitDialog } from '@/components/habits/AddHabitDialog';
import { PageLayout } from '@/components/layout/PageLayout';
import { useHabitsQuery } from '@/pages/TrackingHabitsPage/hooks/useHabitsQuery';
import { useQuery } from '@tanstack/react-query';
import { fetchGroups } from '@/api/group';

export function HabitsPage() {
  const { status, data, error } = useHabitsQuery();
  const { data: groups = [] } = useQuery({ queryKey: ['groups'], queryFn: fetchGroups });

  return (
    <PageLayout title="Habits" actions={<AddHabitDialog />}>
      <div className="flex min-h-0 flex-1 flex-col gap-4 pb-12">
        <div className="flex min-h-0 flex-1 flex-col">
          {status === 'pending' && <p>Loading...</p>}
          {status === 'error' && <p className="text-red-500">{error.message}</p>}
          {status !== 'pending' && status !== 'error' && <HabitCard habits={data} groups={groups} />}
        </div>
      </div>
    </PageLayout>
  );
}
