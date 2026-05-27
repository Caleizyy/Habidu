import HabitCard from '@/components/habits/HabitCard';
import { PageLayout } from '@/components/layout/PageLayout';

export function HabitsPage() {
  return (
    <PageLayout title="Goals">
      <div className="flex flex-1 flex-col">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <HabitCard label={'Timeliness'} choices={['Daily', 'Weekly', 'Monthly']} />
          <HabitCard label={'Category'} choices={['Sports', 'Study', 'Skills', 'Chores']} />
          <HabitCard label={'Placeholder'} choices={['Undecided', 'Another Placeholder']} />
        </div>
      </div>
    </PageLayout>
  );
}
