import * as React from 'react';
import { getTodayDate, getLast4Weeks } from '@/utils/dateHelpers';
import { HabitFrequency } from '@/types/habit';
import { useHabitLogs } from '@/pages/TrackingHabitsPage/hooks/useHabitLogs';
import { friendsApi } from '@/api/friends';
import { fetchGroups, fetchGroupHabit } from '@/api/group';
import type { GroupProgress } from '../components/GroupProgressCard';

export interface HomePageStats {
  totalDaily: number;
  completedDaily: number;
  totalWeekly: number;
  completedWeekly: number;
  totalMonthly: number;
  completedMonthly: number;
}

export function useHomePageData() {
  const TODAY = getTodayDate();
  const WEEKLY_ROW_LABELS = getLast4Weeks(TODAY);

  const habitLogsData = useHabitLogs(WEEKLY_ROW_LABELS);
  const [friendCount, setFriendCount] = React.useState(0);
  const [groupProgress, setGroupProgress] = React.useState<GroupProgress[]>([]);

  React.useEffect(() => {
    friendsApi.getFriends().then((friends) => setFriendCount(friends.length));
  }, []);

  React.useEffect(() => {
    fetchGroups().then(async (groups) => {
      const results = await Promise.allSettled(groups.map((g) => fetchGroupHabit(g._id).then((r) => ({ g, r }))));
      const progress: GroupProgress[] = [];
      for (const result of results) {
        if (result.status === 'fulfilled' && result.value.r) {
          const { g, r } = result.value;
          const grandTotal = r.logs.reduce((sum, l) => sum + l.value, 0);
          progress.push({
            groupId: g._id,
            groupName: g.name,
            grandTotal,
            targetValue: r.habit.targetValue,
            targetUnit: r.habit.targetUnit,
          });
        }
      }
      setGroupProgress(progress);
    });
  }, []);

  const stats = React.useMemo(() => {
    const dailyHabits = habitLogsData.habits.filter((h) => h.frequency === HabitFrequency.Daily);
    const weeklyHabits = habitLogsData.habits.filter((h) => h.frequency === HabitFrequency.Weekly);
    const monthlyHabits = habitLogsData.habits.filter((h) => h.frequency === HabitFrequency.Monthly);

    const countCompleted = (habits: typeof habitLogsData.habits, isDaily: boolean = true) => {
      return habits.filter((h) => {
        if (isDaily) {
          const todayValue = habitLogsData.getDisplayValue(h._id, TODAY);
          return todayValue >= h.targetValue;
        } else {
          return h.currentStreak > 0;
        }
      }).length;
    };

    return {
      totalDaily: dailyHabits.length,
      completedDaily: countCompleted(dailyHabits, true),
      totalWeekly: weeklyHabits.length,
      completedWeekly: countCompleted(weeklyHabits, false),
      totalMonthly: monthlyHabits.length,
      completedMonthly: countCompleted(monthlyHabits, false),
    };
  }, [habitLogsData.habits, habitLogsData.getDisplayValue, TODAY]);

  return {
    habits: habitLogsData.habits,
    sectionStreaks: habitLogsData.sectionStreaks,
    stats,
    loading: habitLogsData.loading,
    error: habitLogsData.error,
    friendCount,
    groupProgress,
  };
}
