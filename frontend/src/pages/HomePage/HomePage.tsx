import { PageLayout } from '@/components/layout/PageLayout';
import { useHomePageData } from './hooks/useHomePageData';
import { StreaksCard } from './components/StreaksCard';
import { ProgressCard } from './components/ProgressCard';

export function HomePage() {
  const { habits, sectionStreaks, stats, loading, error } = useHomePageData();

  if (loading) {
    return (
      <PageLayout title="Home">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
            <p className="text-neutral-600 dark:text-neutral-400">Loading dashboard...</p>
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
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="mb-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">No habits yet..</p>
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

        <div className="lg:col-span-2">
          <h2 className="mb-4 text-2xl text-neutral-900 dark:text-neutral-100">Habit Progress</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
      </div>
    </PageLayout>
  );
}
