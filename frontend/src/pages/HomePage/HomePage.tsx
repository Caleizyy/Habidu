import { PageLayout } from '@/components/layout/PageLayout';
import { useHomePageData } from './hooks/useHomePageData';
import { StreaksCard } from './components/StreaksCard';
import { ProgressCard } from './components/ProgressCard';
import { FriendCountCard } from './components/FriendCountCard';
import leaf from '@/assets/leaf.png';
import { GroupCountCard } from './components/GroupCountCard';

export function HomePage() {
  const { habits, sectionStreaks, stats, loading, error, friendCount, groupCount } = useHomePageData();

  if (loading) {
    return (
      <PageLayout title="Home">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
            <p className="text-neutral-600 dark:text-neutral-400">Loading homepage...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout title="Home">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="mb-2 text-lg font-semibold text-red-600 dark:text-red-400">Something went wrong</p>
            <p className="text-neutral-600 dark:text-neutral-400">{error}</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (habits.length === 0) {
    return (
      <PageLayout title="Home">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-center py-12">
              <div className="item-center text-center">
                <img src={leaf} className="flex size-30"></img>
                <p className="mb-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">No habits yet..</p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <h2 className="mb-4 text-2xl text-neutral-900 dark:text-neutral-100">Community</h2>
            <FriendCountCard friendCount={friendCount} />
            <div className="mt-4">
              <GroupCountCard groupCount={groupCount} />
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Home">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <h2 className="mb-4 text-2xl text-neutral-900 dark:text-neutral-100">Streaks</h2>
          <StreaksCard
            dailyStreak={sectionStreaks.daily.currentStreak}
            dailyPB={sectionStreaks.daily.personalBest}
            weeklyStreak={sectionStreaks.weekly.currentStreak}
            weeklyPB={sectionStreaks.weekly.personalBest}
            monthlyStreak={sectionStreaks.monthly.currentStreak}
            monthlyPB={sectionStreaks.monthly.personalBest}
          />
        </div>

        <div className="lg:col-span-1">
          <h2 className="mb-4 text-2xl text-neutral-900 dark:text-neutral-100">Habit Progress</h2>
          <div className="flex flex-col gap-4">
            <ProgressCard title="Daily" completed={stats.completedDaily} total={stats.totalDaily} periodLabel="today" />
            <ProgressCard
              title="Weekly"
              completed={stats.completedWeekly}
              total={stats.totalWeekly}
              periodLabel="this week"
            />
            <ProgressCard
              title="Monthly"
              completed={stats.completedMonthly}
              total={stats.totalMonthly}
              periodLabel="this month"
            />
          </div>
        </div>

        <div className="lg:col-span-1">
          <h2 className="mb-4 text-2xl text-neutral-900 dark:text-neutral-100">Community</h2>
          <FriendCountCard friendCount={friendCount} />
          <div className="mt-4">
            <GroupCountCard groupCount={groupCount} />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
