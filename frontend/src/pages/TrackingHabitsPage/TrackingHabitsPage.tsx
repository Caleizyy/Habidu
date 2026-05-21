<<<<<<< HEAD
import { PageLayout } from '@/components/layout/PageLayout';

export function TrackingHabitsPage() {
  return (
    <PageLayout title="Tracking Habits">
      <div></div>
    </PageLayout>
=======
import * as React from 'react';
import { HabitFrequency, PeriodCell } from '@/types/habit';
import {
  buildDailyCells,
  buildWeeklyCells,
  buildMonthlyCells,
  getTodayDate,
  getDailyRowLabels,
  getLast4Weeks,
  getLast5Months,
  getFullWeek,
  formatDate,
} from '@/utils/habitHelpers';
import { useHabitLogs } from './hooks/useHabitLogs';
import { DailyHabitsSection } from './sections/DailyHabitsSection';
import { WeeklyHabitsSection } from './sections/WeeklyHabitsSection';
import { MonthlyHabitsSection } from './sections/MonthlyHabitsSection';

export function TrackingHabitsPage(): React.ReactNode {
  // Calculate dynamic date values
  const TODAY = getTodayDate();
  const DAILY_ROW_LABELS = getDailyRowLabels(TODAY);
  const WEEKLY_ROW_LABELS = getLast4Weeks(TODAY);
  const MONTHLY_ROW_LABELS = getLast5Months(TODAY);
  const DAILY_DATES = getFullWeek(TODAY);
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
      <div className="container mx-auto py-8">
        <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-neutral-900">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
              <p className="text-neutral-600 dark:text-neutral-400">Loading habits...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (hookState.error) {
    return (
      <div className="container mx-auto py-8">
        <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-neutral-900">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="mb-2 text-lg font-semibold text-red-600 dark:text-red-400">Something went wrong</p>
              <p className="text-neutral-600 dark:text-neutral-400">{hookState.error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (hookState.habits.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-neutral-900">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-neutral-600 dark:text-neutral-400">No habits found. Create your first habit.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="rounded-2xl bg-white p-6 shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Tracking Habits</h1>
          <button
            onClick={hookState.saveDrafts}
            disabled={!hookState.hasUnsavedChanges || hookState.isSaving}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-colors ${
              hookState.hasUnsavedChanges
                ? hookState.isSaving
                  ? 'cursor-wait bg-green-400 text-white dark:bg-green-700'
                  : 'bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700'
                : 'invisible'
            }`}
          >
            {hookState.isSaving && (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            )}
            Save Changes
          </button>
        </div>

        <hr className="my-4 border-neutral-200 dark:border-neutral-700" />

        <DailyHabitsSection
          habits={dailyHabits}
          barCellsMap={dailyBarCells}
          rangeLabel={dailyRangeLabel}
          dailyRowLabels={DAILY_ROW_LABELS}
          expandedDailyDate={hookState.expandedDailyDate}
          setExpandedDailyDate={hookState.setExpandedDailyDate}
          pastDaysOpen={hookState.pastDaysOpen}
          setPastDaysOpen={hookState.setPastDaysOpen}
          pastDaysPage={hookState.pastDaysPage}
          setPastDaysPage={hookState.setPastDaysPage}
          getDisplayValue={hookState.getDisplayValue}
          addLog={hookState.addLog}
          editLog={hookState.editLog}
          undoLog={hookState.undoLog}
          dailyHighlightIndex={dailyHighlightIndex}
        />

        <hr className="my-4 border-neutral-200 dark:border-neutral-700" />

        <WeeklyHabitsSection
          habits={weeklyHabits}
          barCellsMap={weeklyBarCells}
          rangeLabel={weeklyRangeLabel}
          weeklyRowLabels={WEEKLY_ROW_LABELS}
          expandedPastWeek={hookState.expandedPastWeek}
          setExpandedPastWeek={hookState.setExpandedPastWeek}
          pastWeeksOpen={hookState.pastWeeksOpen}
          setPastWeeksOpen={hookState.setPastWeeksOpen}
          pastWeeksPage={hookState.pastWeeksPage}
          setPastWeeksPage={hookState.setPastWeeksPage}
          getDisplayValueForDates={hookState.getDisplayValueForDates}
          getDisplayValueForWeek={hookState.getDisplayValueForWeek}
          addLog={hookState.addLog}
          editLog={hookState.editLog}
          undoLog={hookState.undoLog}
          today={TODAY}
        />

        <hr className="my-4 border-neutral-200 dark:border-neutral-700" />

        <MonthlyHabitsSection
          habits={monthlyHabits}
          barCellsMap={monthlyBarCells}
          rangeLabel={monthlyRangeLabel}
          monthlyRowLabels={MONTHLY_ROW_LABELS}
          expandedPastMonth={hookState.expandedPastMonth}
          setExpandedPastMonth={hookState.setExpandedPastMonth}
          pastMonthsOpen={hookState.pastMonthsOpen}
          setPastMonthsOpen={hookState.setPastMonthsOpen}
          pastMonthsPage={hookState.pastMonthsPage}
          setPastMonthsPage={hookState.setPastMonthsPage}
          getDisplayValueForMonth={hookState.getDisplayValueForMonth}
          getDisplayValueForMonthKey={hookState.getDisplayValueForMonthKey}
          addLog={hookState.addLog}
          editLog={hookState.editLog}
          undoLog={hookState.undoLog}
          today={TODAY}
        />
      </div>
    </div>
>>>>>>> c0b67fc (Habit Tracking Page base)
  );
}
