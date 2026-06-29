import * as React from 'react';
import { HabitFrequency, PeriodCell } from '@/types/habit';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/Button';
import { buildDailyCells, buildWeeklyCells, buildMonthlyCells } from '@/utils/habitHelpers';
import {
  getTodayDate,
  getDailyRowLabels,
  getLast4Weeks,
  getLast5Months,
  getFullWeek,
  formatDate,
} from '@/utils/dateHelpers';
import { useHabitLogs } from './hooks/useHabitLogs';
import { DailyHabitsSection } from './sections/DailyHabitsSection';
import { WeeklyHabitsSection } from './sections/WeeklyHabitsSection';
import { MonthlyHabitsSection } from './sections/MonthlyHabitsSection';
import { toast } from 'sonner';
import { toastSuccess, toastError } from '@/constants/ToastStyles.constants';

export function TrackingHabitsPage(): React.ReactNode {
  // Calculate dynamic date values
  const TODAY = getTodayDate();
  const DAILY_ROW_LABELS = getDailyRowLabels(TODAY);
  const WEEKLY_ROW_LABELS = getLast4Weeks(TODAY);
  const MONTHLY_ROW_LABELS = getLast5Months(TODAY);
  const DAILY_DATES = getFullWeek();
  const MONTHLY_KEYS = MONTHLY_ROW_LABELS.map((m) => m.monthKey);

  // Calculate which day is today in the daily bar chart (Monday=0 to Sunday=6)
  const todayDate = new Date(TODAY + 'T00:00:00');
  const dayOfWeek = todayDate.getDay();
  const dailyHighlightIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  // Generate range labels
  const dailyRangeLabel = DAILY_DATES.length > 0 ? `${formatDate(DAILY_DATES[0])} – ${formatDate(DAILY_DATES[6])}` : '';
  const weeklyRangeLabel =
    WEEKLY_ROW_LABELS.length > 0
      ? `${WEEKLY_ROW_LABELS[WEEKLY_ROW_LABELS.length - 1]?.label?.split(' - ')[0]} – ${WEEKLY_ROW_LABELS[0]?.label?.split(' - ')[1]}`
      : '';
  const monthlyRangeLabel =
    MONTHLY_ROW_LABELS.length > 0
      ? `${MONTHLY_ROW_LABELS[MONTHLY_ROW_LABELS.length - 1]?.label} – ${MONTHLY_ROW_LABELS[0]?.label}`
      : '';

  // Use habit logs hook
  const hookState = useHabitLogs(WEEKLY_ROW_LABELS);

  const handleSaveChanges = async () => {
    try {
      await hookState.saveDrafts();
      toast.success('Your changes were saved successfully!', toastSuccess);
    } catch {
      toast.error('Failed to save changes. Please try again.', toastError);
    }
  };

  // Build bar cells for visualizations
  const dailyBarCells: Record<string, PeriodCell[]> = {};
  const weeklyBarCells: Record<string, PeriodCell[]> = {};
  const monthlyBarCells: Record<string, PeriodCell[]> = {};

  const dailyHabits = hookState.habits.filter((h) => h.frequency === HabitFrequency.Daily);
  const weeklyHabits = hookState.habits.filter((h) => h.frequency === HabitFrequency.Weekly);
  const monthlyHabits = hookState.habits.filter((h) => h.frequency === HabitFrequency.Monthly);

  dailyHabits.forEach((h) => {
    dailyBarCells[h._id] = buildDailyCells(h, hookState.logs[h._id] ?? [], DAILY_DATES);
  });

  const weeklyLabels = WEEKLY_ROW_LABELS.map((w) => ({ weekKey: w.weekKey, label: w.label }));
  weeklyHabits.forEach((h) => {
    weeklyBarCells[h._id] = buildWeeklyCells(h, hookState.logs[h._id] ?? [], weeklyLabels);
  });

  monthlyHabits.forEach((h) => {
    monthlyBarCells[h._id] = buildMonthlyCells(h, hookState.logs[h._id] ?? [], MONTHLY_KEYS);
  });

  // Loading state
  if (hookState.loading) {
    return (
      <PageLayout title="Tracking Habits">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
            <p className="text-neutral-600 dark:text-neutral-400">Loading habits...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Error state
  if (hookState.error) {
    return (
      <PageLayout title="Tracking Habits">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="mb-2 text-lg font-semibold text-red-600 dark:text-red-400">Something went wrong</p>
            <p className="text-neutral-600 dark:text-neutral-400">{hookState.error}</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Empty state
  if (hookState.habits.length === 0) {
    return (
      <PageLayout title="Tracking Habits">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-neutral-600 dark:text-neutral-400">No habits found. Create your first habit.</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Tracking Habits"
      actions={
        <Button
          onClick={handleSaveChanges}
          disabled={!hookState.hasUnsavedChanges || hookState.isSaving}
          variant="success"
          className={hookState.hasUnsavedChanges ? '' : 'invisible'}
        >
          {hookState.isSaving && (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          )}
          Save Changes
        </Button>
      }
    >
      <hr className="my-4 border-neutral-200 dark:border-neutral-700" />

      <DailyHabitsSection
        habits={dailyHabits}
        barCellsMap={dailyBarCells}
        rangeLabel={dailyRangeLabel}
        dailyRowLabels={DAILY_ROW_LABELS}
        getDisplayValue={hookState.getDisplayValue}
        addLog={hookState.addLog}
        editLog={hookState.editLog}
        undoLog={hookState.undoLog}
        dailyHighlightIndex={dailyHighlightIndex}
        sectionStreak={hookState.sectionStreaks.daily.currentStreak}
        sectionPersonalBest={hookState.sectionStreaks.daily.personalBest}
      />

      <hr className="my-4 border-neutral-200 dark:border-neutral-700" />

      <WeeklyHabitsSection
        habits={weeklyHabits}
        barCellsMap={weeklyBarCells}
        rangeLabel={weeklyRangeLabel}
        weeklyRowLabels={WEEKLY_ROW_LABELS}
        getDisplayValueForDates={hookState.getDisplayValueForDates}
        addLog={hookState.addLog}
        editWeeklyLog={hookState.editWeeklyLog}
        undoWeeklyLog={hookState.undoWeeklyLog}
        sectionStreak={hookState.sectionStreaks.weekly.currentStreak}
        sectionPersonalBest={hookState.sectionStreaks.weekly.personalBest}
      />

      <hr className="my-4 border-neutral-200 dark:border-neutral-700" />

      <MonthlyHabitsSection
        habits={monthlyHabits}
        barCellsMap={monthlyBarCells}
        rangeLabel={monthlyRangeLabel}
        monthlyRowLabels={MONTHLY_ROW_LABELS}
        getDisplayValueForMonth={hookState.getDisplayValueForMonth}
        addLog={hookState.addLog}
        editMonthlyLog={hookState.editMonthlyLog}
        undoMonthlyLog={hookState.undoMonthlyLog}
        sectionStreak={hookState.sectionStreaks.monthly.currentStreak}
        sectionPersonalBest={hookState.sectionStreaks.monthly.personalBest}
      />
    </PageLayout>
  );
}
