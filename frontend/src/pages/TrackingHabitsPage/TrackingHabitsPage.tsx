<<<<<<< HEAD
import { PageLayout } from '@/components/layout/PageLayout';

export function TrackingHabitsPage() {
  return (
    <PageLayout title="Tracking Habits">
      <div></div>
    </PageLayout>
=======
import * as React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/Pagination';
import { HabitFrequency, Habit, HabitLog, PeriodCell } from '@/types/habit';
import {
  buildDailyCells,
  buildWeeklyCells,
  buildMonthlyCells,
  monthKey,
  getTodayDate,
  getDailyRowLabels,
  getLast4Weeks,
  getLast5Months,
  getFullWeek,
  formatDate,
} from '@/utils/habitHelpers';
import { fetchHabits, fetchLogsForHabit, createLog, updateLog, deleteLog } from '@/services/habitService';
import { PastPeriodRow, HabitDetailRow, LogRow, HabitSection } from './components';

export function TrackingHabitsPage(): React.ReactNode {
  // Calculate dynamic date values
  const TODAY = getTodayDate();
  const DAILY_ROW_LABELS = getDailyRowLabels(TODAY);
  const WEEKLY_ROW_LABELS = getLast4Weeks(TODAY);
  const MONTHLY_ROW_LABELS = getLast5Months(TODAY);
  const DAILY_DATES = getFullWeek(TODAY); // Full week Mon-Sun for bar chart
  const MONTHLY_KEYS = MONTHLY_ROW_LABELS.map((m) => m.monthKey);

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

  // Data state — fetch from API
  const [habits, setHabits] = React.useState<Habit[]>([]);
  const [logs, setLogs] = React.useState<Record<string, HabitLog[]>>({});
  const [drafts, setDrafts] = React.useState<Record<string, Record<string, number>>>({});
  const [originalValues, setOriginalValues] = React.useState<Record<string, Record<string, number>>>({});
  const [deletedLogIds, setDeletedLogIds] = React.useState<Record<string, string>>({});
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Collapsible past sections state
  const [pastDaysOpen, setPastDaysOpen] = React.useState(false);
  const [pastWeeksOpen, setPastWeeksOpen] = React.useState(false);
  const [pastMonthsOpen, setPastMonthsOpen] = React.useState(false);

  // Pagination state for past sections (items per page)
  const ITEMS_PER_PAGE = 5;
  const [pastDaysPage, setPastDaysPage] = React.useState(1);
  const [pastWeeksPage, setPastWeeksPage] = React.useState(1);
  const [pastMonthsPage, setPastMonthsPage] = React.useState(1);

  // Expansion state for individual periods (dates, weeks, months)
  const [expandedDailyDates, setExpandedDailyDates] = React.useState<Set<string>>(new Set([TODAY]));
  const [expandedPastWeeks, setExpandedPastWeeks] = React.useState<Set<string>>(new Set());
  const [expandedPastMonths, setExpandedPastMonths] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        // Calculate date range: last 1 year from today
        const todayDate = new Date(TODAY + 'T00:00:00');
        const oneYearAgo = new Date(todayDate);
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        const startDate = `${oneYearAgo.getFullYear()}-${String(oneYearAgo.getMonth() + 1).padStart(2, '0')}-${String(oneYearAgo.getDate()).padStart(2, '0')}`;
        const endDate = TODAY;

        // Fetch all habits
        const habitsData = await fetchHabits();
        setHabits(habitsData);

        // Fetch logs for each habit
        const logsData: Record<string, HabitLog[]> = {};
        await Promise.all(
          habitsData.map(async (habit) => {
            try {
              logsData[habit._id] = await fetchLogsForHabit(habit._id, startDate, endDate);
            } catch (err) {
              console.error(`Failed to fetch logs for habit ${habit._id}:`, err);
              logsData[habit._id] = [];
            }
          })
        );
        setLogs(logsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [TODAY]);

  async function addLog(habitId: string, value: number, date: string = TODAY) {
    // Store original value if not already stored
    const currentDisplayValue = getDisplayValue(habitId, date);

    setOriginalValues((prev) => ({
      ...prev,
      [habitId]: { ...(prev[habitId] ?? {}), [date]: prev[habitId]?.[date] ?? currentDisplayValue },
    }));

    // Update draft state instead of API
    setDrafts((prev) => ({
      ...prev,
      [habitId]: { ...(prev[habitId] ?? {}), [date]: value },
    }));
  }

  async function editLog(habitId: string, date: string, newValue: number) {
    // Store original value if not already stored
    const currentDisplayValue = getDisplayValue(habitId, date);

    setOriginalValues((prev) => ({
      ...prev,
      [habitId]: { ...(prev[habitId] ?? {}), [date]: prev[habitId]?.[date] ?? currentDisplayValue },
    }));

    // Update draft state instead of API
    setDrafts((prev) => ({
      ...prev,
      [habitId]: { ...(prev[habitId] ?? {}), [date]: newValue },
    }));
  }

  async function undoLog(habitId: string, date: string) {
    // Check if this is a draft (unsaved change)
    const isDraft = drafts[habitId]?.[date] !== undefined;

    if (isDraft) {
      // Undo draft (in-memory only)
      setDrafts((prev) => {
        const habitDrafts = { ...prev[habitId] };
        delete habitDrafts[date];
        return { ...prev, [habitId]: habitDrafts };
      });

      setOriginalValues((prev) => {
        const habitOriginals = { ...prev[habitId] };
        delete habitOriginals[date];
        return { ...prev, [habitId]: habitOriginals };
      });
    } else {
      // Undo saved logs - mark for deletion (don't delete immediately)
      const savedLogs = logs[habitId] ?? [];
      const logToDelete = savedLogs.find((l) => l.date === date);

      if (logToDelete) {
        // Store logId -> habitId mapping for later deletion
        setDeletedLogIds((prev) => ({
          ...prev,
          [logToDelete._id]: habitId,
        }));

        // Show the log as 0 immediately in the UI
        setLogs((prev) => ({
          ...prev,
          [habitId]: (prev[habitId] ?? []).filter((l) => l._id !== logToDelete._id),
        }));
      }
    }
  }

  // Helper: get display value (draft if exists, otherwise saved log sum)
  function getDisplayValue(habitId: string, date: string): number {
    const draftValue = drafts[habitId]?.[date];
    if (draftValue !== undefined) return draftValue;
    return (logs[habitId] ?? [])
      .filter((l) => l.date === date && !(l._id in deletedLogIds))
      .reduce((s, l) => s + l.value, 0);
  }

  // Helper: get display value for date range (sums all dates, checking drafts first)
  function getDisplayValueForDates(habitId: string, dates: string[]): number {
    const set = new Set(dates);
    // Check if there's a draft for TODAY (which is where we log for weekly/monthly)
    const todayDraft = drafts[habitId]?.[TODAY];
    if (todayDraft !== undefined) return todayDraft;
    // Otherwise sum from saved logs
    return (logs[habitId] ?? [])
      .filter((l) => set.has(l.date) && !(l._id in deletedLogIds))
      .reduce((s, l) => s + l.value, 0);
  }

  // Helper: get display value for month (checking draft for TODAY if it's in this month)
  function getDisplayValueForMonth(habitId: string, mKey: string): number {
    // Check if there's a draft for TODAY (which is where we log for monthly)
    const todayDraft = drafts[habitId]?.[TODAY];
    if (todayDraft !== undefined && monthKey(TODAY) === mKey) return todayDraft;
    // Otherwise sum from saved logs
    return (logs[habitId] ?? [])
      .filter((l) => monthKey(l.date) === mKey && !(l._id in deletedLogIds))
      .reduce((s, l) => s + l.value, 0);
  }

  // Check if there are any unsaved changes
  const hasUnsavedChanges =
    Object.values(drafts).some((habitDrafts) => Object.keys(habitDrafts).length > 0) ||
    Object.keys(deletedLogIds).length > 0;

  // Batch save all drafts to backend
  async function saveDrafts() {
    try {
      const updates: Array<{ habitId: string; date: string; value: number }> = [];
      Object.entries(drafts).forEach(([habitId, dates]) => {
        Object.entries(dates).forEach(([date, value]) => {
          updates.push({ habitId, date, value });
        });
      });

      // Execute all updates in parallel
      await Promise.all(
        updates.map(({ habitId, date, value }) => {
          const existingLogs = logs[habitId] ?? [];
          const logToUpdate = existingLogs.find((l) => l.date === date);

          if (logToUpdate) {
            return updateLog(habitId, logToUpdate._id, value);
          } else {
            return createLog(habitId, date, value);
          }
        })
      );

      // Execute all deletions in parallel
      await Promise.all(
        Object.entries(deletedLogIds).map(([logId, habitId]) => {
          return deleteLog(habitId, logId);
        })
      );

      // Reload logs to sync with backend
      const startDate = `${new Date(TODAY + 'T00:00:00').getFullYear() - 1}-01-01`;
      const endDate = TODAY;
      const logsData: Record<string, HabitLog[]> = {};
      await Promise.all(
        habits.map(async (habit) => {
          try {
            logsData[habit._id] = await fetchLogsForHabit(habit._id, startDate, endDate);
          } catch (err) {
            console.error(`Failed to fetch logs for habit ${habit._id}:`, err);
            logsData[habit._id] = [];
          }
        })
      );
      setLogs(logsData);

      // Clear drafts and deletions after successful save
      setDrafts({});
      setDeletedLogIds({});
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save changes');
      console.error('Error saving drafts:', err);
    }
  }

  // Sum logs for a specific date
  function sumForDate(habitId: string, date: string): number {
    return (logs[habitId] ?? [])
      .filter((l) => l.date === date && !(l._id in deletedLogIds))
      .reduce((s, l) => s + l.value, 0);
  }

  // Sum logs for a set of dates (week/month period)
  function sumForDates(habitId: string, dates: string[]): number {
    const set = new Set(dates);
    return (logs[habitId] ?? [])
      .filter((l) => set.has(l.date) && !(l._id in deletedLogIds))
      .reduce((s, l) => s + l.value, 0);
  }

  // Sum logs for a specific month
  function sumForMonth(habitId: string, mKey: string): number {
    return (logs[habitId] ?? [])
      .filter((l) => monthKey(l.date) === mKey && !(l._id in deletedLogIds))
      .reduce((s, l) => s + l.value, 0);
  }

  const dailyHabits = habits.filter((h) => h.frequency === HabitFrequency.Daily);
  const weeklyHabits = habits.filter((h) => h.frequency === HabitFrequency.Weekly);
  const monthlyHabits = habits.filter((h) => h.frequency === HabitFrequency.Monthly);

  const dailyBarCells: Record<string, PeriodCell[]> = {};
  const weeklyBarCells: Record<string, PeriodCell[]> = {};
  const monthlyBarCells: Record<string, PeriodCell[]> = {};

  dailyHabits.forEach((h) => {
    dailyBarCells[h._id] = buildDailyCells(h, logs[h._id] ?? [], DAILY_DATES);
  });

  // For weekly, use weekKeys for the bar summary
  const WEEKLY_KEYS = WEEKLY_ROW_LABELS.map((w) => w.weekKey);
  weeklyHabits.forEach((h) => {
    weeklyBarCells[h._id] = buildWeeklyCells(h, logs[h._id] ?? [], WEEKLY_KEYS);
  });
  monthlyHabits.forEach((h) => {
    monthlyBarCells[h._id] = buildMonthlyCells(h, logs[h._id] ?? [], MONTHLY_KEYS);
  });

  if (loading) {
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

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-neutral-900">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="mb-4 text-red-600 dark:text-red-400">Error: {error}</p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Make sure the backend is running at http://localhost:5000
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (habits.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-neutral-900">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-neutral-600 dark:text-neutral-400">No habits found. Create your first habit!</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="rounded-2xl bg-white p-6 shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Tracking Habits</h1>
          <button
            onClick={saveDrafts}
            disabled={!hasUnsavedChanges}
            className={`rounded-lg px-4 py-2 font-medium transition-colors ${
              hasUnsavedChanges
                ? 'bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700'
                : 'invisible'
            }`}
          >
            Save Changes
          </button>
        </div>

        <hr className="my-4 border-neutral-200 dark:border-neutral-700" />

        {/* ── DAILY SECTION ── */}
        <HabitSection title="Daily" rangeLabel={dailyRangeLabel} habits={dailyHabits} barCellsMap={dailyBarCells}>
          {/* TODAY section */}
          {DAILY_ROW_LABELS.slice(-1).map((row: { date: string; label: string; sublabel?: string }) => {
            return (
              <div key={`today-section-${row.date}`}>
                <div className="flex items-center gap-2 border-y-2 border-blue-200 bg-blue-50 px-4 py-2 dark:border-blue-900 dark:bg-blue-950/30">
                  <span className="text-xs font-bold tracking-wider text-blue-600 uppercase dark:text-blue-400">
                    Today · {row.label}
                  </span>
                </div>
                {dailyHabits.map((habit) => (
                  <LogRow
                    key={habit._id}
                    periodLabel={habit.name}
                    value={getDisplayValue(habit._id, row.date)}
                    target={habit.targetValue}
                    unit={habit.targetUnit}
                    isCurrentPeriod={true}
                    isDraft={!!drafts[habit._id]?.[row.date]}
                    onQuickLog={() => addLog(habit._id, habit.targetValue, row.date)}
                    onEdit={(newVal) => editLog(habit._id, row.date, newVal)}
                    onUndo={() => undoLog(habit._id, row.date)}
                  />
                ))}
              </div>
            );
          })}

          {/* PAST section */}
          {DAILY_ROW_LABELS.slice(0, -1).length > 0 && (
            <>
              <button
                onClick={() => setPastDaysOpen((o) => !o)}
                className="hover:bg-neutral-150 flex w-full items-center gap-2 border-b border-neutral-200 bg-neutral-100 px-4 py-2 transition-colors dark:border-neutral-700 dark:bg-neutral-800/80 dark:hover:bg-neutral-800"
              >
                <span className="text-xs font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
                  Past days
                </span>
                <svg
                  className={`ml-auto h-4 w-4 text-neutral-400 transition-transform ${pastDaysOpen ? 'rotate-180' : ''}`}
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M4 6l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {pastDaysOpen && (
                <>
                  {(() => {
                    const pastRows = DAILY_ROW_LABELS.slice(0, -1).reverse();
                    const totalPages = Math.ceil(pastRows.length / ITEMS_PER_PAGE);
                    const start = (pastDaysPage - 1) * ITEMS_PER_PAGE;
                    const paginatedRows = pastRows.slice(start, start + ITEMS_PER_PAGE);

                    return (
                      <>
                        {paginatedRows.map((row: { date: string; label: string; sublabel?: string }) => {
                          const combinedValue = dailyHabits.reduce((s, h) => s + sumForDate(h._id, row.date), 0);
                          const combinedTarget = dailyHabits.reduce((s, h) => s + h.targetValue, 0);
                          const isRowExpanded = expandedDailyDates.has(row.date);

                          return (
                            <PastPeriodRow
                              key={row.date}
                              periodLabel={row.label}
                              value={combinedValue}
                              target={combinedTarget}
                              isExpanded={isRowExpanded}
                              onToggle={() => {
                                const newSet = new Set(expandedDailyDates);
                                if (newSet.has(row.date)) {
                                  newSet.delete(row.date);
                                } else {
                                  newSet.add(row.date);
                                }
                                setExpandedDailyDates(newSet);
                              }}
                            >
                              {dailyHabits.map((habit) => (
                                <LogRow
                                  key={habit._id}
                                  periodLabel={habit.name}
                                  value={getDisplayValue(habit._id, row.date)}
                                  target={habit.targetValue}
                                  unit={habit.targetUnit}
                                  isCurrentPeriod={false}
                                  isDraft={!!drafts[habit._id]?.[row.date]}
                                  onQuickLog={() => addLog(habit._id, habit.targetValue, row.date)}
                                  onEdit={(newVal) => editLog(habit._id, row.date, newVal)}
                                  onUndo={() => undoLog(habit._id, row.date)}
                                />
                              ))}
                            </PastPeriodRow>
                          );
                        })}

                        {/* Pagination for past days */}
                        <div className="border-t border-neutral-200 px-4 py-3 dark:border-neutral-700">
                          <Pagination>
                            <PaginationContent>
                              <PaginationItem>
                                <PaginationPrevious
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setPastDaysPage((p) => Math.max(1, p - 1));
                                  }}
                                  className={pastDaysPage === 1 ? 'pointer-events-none opacity-50' : ''}
                                />
                              </PaginationItem>
                              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                <PaginationItem key={pageNum}>
                                  <PaginationLink
                                    href="#"
                                    isActive={pageNum === pastDaysPage}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setPastDaysPage(pageNum);
                                    }}
                                  >
                                    {pageNum}
                                  </PaginationLink>
                                </PaginationItem>
                              ))}
                              <PaginationItem>
                                <PaginationNext
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setPastDaysPage((p) => Math.min(totalPages, p + 1));
                                  }}
                                  className={pastDaysPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                                />
                              </PaginationItem>
                            </PaginationContent>
                          </Pagination>
                        </div>
                      </>
                    );
                  })()}
                </>
              )}
            </>
          )}
        </HabitSection>

        <hr className="my-4 border-neutral-200 dark:border-neutral-700" />

        {/* ── WEEKLY SECTION ── */}
        <HabitSection title="Weekly" rangeLabel={weeklyRangeLabel} habits={weeklyHabits} barCellsMap={weeklyBarCells}>
          {/* THIS WEEK section */}
          {WEEKLY_ROW_LABELS.slice(0, 1).map((row) => {
            return (
              <div key={`this-week-section-${row.weekKey}`}>
                <div className="flex items-center gap-2 border-y-2 border-blue-200 bg-blue-50 px-4 py-2 dark:border-blue-900 dark:bg-blue-950/30">
                  <span className="text-xs font-bold tracking-wider text-blue-600 uppercase dark:text-blue-400">
                    This Week · {row.label}
                  </span>
                </div>
                {weeklyHabits.map((habit) => (
                  <LogRow
                    key={habit._id}
                    periodLabel={habit.name}
                    value={getDisplayValueForDates(habit._id, row.dates)}
                    target={habit.targetValue}
                    unit={habit.targetUnit}
                    isCurrentPeriod={true}
                    isDraft={!!drafts[habit._id]?.[TODAY]}
                    onQuickLog={() => addLog(habit._id, habit.targetValue, TODAY)}
                    onEdit={(newVal) => editLog(habit._id, TODAY, newVal)}
                    onUndo={() => undoLog(habit._id, TODAY)}
                  />
                ))}
              </div>
            );
          })}

          {/* PAST WEEKS section */}
          {WEEKLY_ROW_LABELS.slice(1).length > 0 && (
            <>
              <button
                onClick={() => setPastWeeksOpen((o) => !o)}
                className="hover:bg-neutral-150 flex w-full items-center gap-2 border-b border-neutral-200 bg-neutral-100 px-4 py-2 transition-colors dark:border-neutral-700 dark:bg-neutral-800/80 dark:hover:bg-neutral-800"
              >
                <span className="text-xs font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
                  Past weeks
                </span>
                <svg
                  className={`ml-auto h-4 w-4 text-neutral-400 transition-transform ${pastWeeksOpen ? 'rotate-180' : ''}`}
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M4 6l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {pastWeeksOpen && (
                <>
                  {(() => {
                    const pastRows = WEEKLY_ROW_LABELS.slice(1);
                    const totalPages = Math.ceil(pastRows.length / ITEMS_PER_PAGE);
                    const start = (pastWeeksPage - 1) * ITEMS_PER_PAGE;
                    const paginatedRows = pastRows.slice(start, start + ITEMS_PER_PAGE);

                    return (
                      <>
                        {paginatedRows.map((row) => {
                          const combinedValue = weeklyHabits.reduce((s, h) => s + sumForDates(h._id, row.dates), 0);
                          const combinedTarget = weeklyHabits.reduce((s, h) => s + h.targetValue, 0);
                          const isRowExpanded = expandedPastWeeks.has(row.weekKey);

                          return (
                            <PastPeriodRow
                              key={`past-week-${row.weekKey}`}
                              periodLabel={row.label}
                              value={combinedValue}
                              target={combinedTarget}
                              isExpanded={isRowExpanded}
                              onToggle={() => {
                                const newSet = new Set(expandedPastWeeks);
                                if (newSet.has(row.weekKey)) {
                                  newSet.delete(row.weekKey);
                                } else {
                                  newSet.add(row.weekKey);
                                }
                                setExpandedPastWeeks(newSet);
                              }}
                            >
                              {weeklyHabits.map((habit) => (
                                <HabitDetailRow
                                  key={`${row.weekKey}-${habit._id}`}
                                  habitName={habit.name}
                                  value={sumForDates(habit._id, row.dates)}
                                  target={habit.targetValue}
                                  unit={habit.targetUnit}
                                />
                              ))}
                            </PastPeriodRow>
                          );
                        })}

                        {/* Pagination for past weeks */}
                        <div className="border-t border-neutral-200 px-4 py-3 dark:border-neutral-700">
                          <Pagination>
                            <PaginationContent>
                              <PaginationItem>
                                <PaginationPrevious
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setPastWeeksPage((p) => Math.max(1, p - 1));
                                  }}
                                  className={pastWeeksPage === 1 ? 'pointer-events-none opacity-50' : ''}
                                />
                              </PaginationItem>
                              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                <PaginationItem key={pageNum}>
                                  <PaginationLink
                                    href="#"
                                    isActive={pageNum === pastWeeksPage}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setPastWeeksPage(pageNum);
                                    }}
                                  >
                                    {pageNum}
                                  </PaginationLink>
                                </PaginationItem>
                              ))}
                              <PaginationItem>
                                <PaginationNext
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setPastWeeksPage((p) => Math.min(totalPages, p + 1));
                                  }}
                                  className={pastWeeksPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                                />
                              </PaginationItem>
                            </PaginationContent>
                          </Pagination>
                        </div>
                      </>
                    );
                  })()}
                </>
              )}
            </>
          )}
        </HabitSection>

        <hr className="my-4 border-neutral-200 dark:border-neutral-700" />

        {/* ── MONTHLY SECTION ── */}
        <HabitSection
          title="Monthly"
          rangeLabel={monthlyRangeLabel}
          habits={monthlyHabits}
          barCellsMap={monthlyBarCells}
        >
          {/* THIS MONTH section */}
          {MONTHLY_ROW_LABELS.slice(0, 1).map((row) => {
            return (
              <div key={`this-month-section-${row.monthKey}`}>
                <div className="flex items-center gap-2 border-y-2 border-blue-200 bg-blue-50 px-4 py-2 dark:border-blue-900 dark:bg-blue-950/30">
                  <span className="text-xs font-bold tracking-wider text-blue-600 uppercase dark:text-blue-400">
                    This Month · {row.label}
                  </span>
                </div>
                {monthlyHabits.map((habit) => (
                  <LogRow
                    key={habit._id}
                    periodLabel={habit.name}
                    value={getDisplayValueForMonth(habit._id, row.monthKey)}
                    target={habit.targetValue}
                    unit={habit.targetUnit}
                    isCurrentPeriod={true}
                    isDraft={!!drafts[habit._id]?.[TODAY]}
                    onQuickLog={() => addLog(habit._id, habit.targetValue, TODAY)}
                    onEdit={(newVal) => editLog(habit._id, TODAY, newVal)}
                    onUndo={() => undoLog(habit._id, TODAY)}
                  />
                ))}
              </div>
            );
          })}

          {/* PAST MONTHS section */}
          {MONTHLY_ROW_LABELS.slice(1).length > 0 && (
            <>
              <button
                onClick={() => setPastMonthsOpen((o) => !o)}
                className="hover:bg-neutral-150 flex w-full items-center gap-2 border-b border-neutral-200 bg-neutral-100 px-4 py-2 transition-colors dark:border-neutral-700 dark:bg-neutral-800/80 dark:hover:bg-neutral-800"
              >
                <span className="text-xs font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
                  Past months
                </span>
                <svg
                  className={`ml-auto h-4 w-4 text-neutral-400 transition-transform ${pastMonthsOpen ? 'rotate-180' : ''}`}
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M4 6l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {pastMonthsOpen && (
                <>
                  {(() => {
                    const pastRows = MONTHLY_ROW_LABELS.slice(1);
                    const totalPages = Math.ceil(pastRows.length / ITEMS_PER_PAGE);
                    const start = (pastMonthsPage - 1) * ITEMS_PER_PAGE;
                    const paginatedRows = pastRows.slice(start, start + ITEMS_PER_PAGE);

                    return (
                      <>
                        {paginatedRows.map((row) => {
                          const combinedValue = monthlyHabits.reduce((s, h) => s + sumForMonth(h._id, row.monthKey), 0);
                          const combinedTarget = monthlyHabits.reduce((s, h) => s + h.targetValue, 0);
                          const isRowExpanded = expandedPastMonths.has(row.monthKey);

                          return (
                            <PastPeriodRow
                              key={`past-month-${row.monthKey}`}
                              periodLabel={row.label}
                              value={combinedValue}
                              target={combinedTarget}
                              isExpanded={isRowExpanded}
                              onToggle={() => {
                                const newSet = new Set(expandedPastMonths);
                                if (newSet.has(row.monthKey)) {
                                  newSet.delete(row.monthKey);
                                } else {
                                  newSet.add(row.monthKey);
                                }
                                setExpandedPastMonths(newSet);
                              }}
                            >
                              {monthlyHabits.map((habit) => (
                                <HabitDetailRow
                                  key={`${row.monthKey}-${habit._id}`}
                                  habitName={habit.name}
                                  value={sumForMonth(habit._id, row.monthKey)}
                                  target={habit.targetValue}
                                  unit={habit.targetUnit}
                                />
                              ))}
                            </PastPeriodRow>
                          );
                        })}

                        {/* Pagination for past months */}
                        <div className="border-t border-neutral-200 px-4 py-3 dark:border-neutral-700">
                          <Pagination>
                            <PaginationContent>
                              <PaginationItem>
                                <PaginationPrevious
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setPastMonthsPage((p) => Math.max(1, p - 1));
                                  }}
                                  className={pastMonthsPage === 1 ? 'pointer-events-none opacity-50' : ''}
                                />
                              </PaginationItem>
                              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                <PaginationItem key={pageNum}>
                                  <PaginationLink
                                    href="#"
                                    isActive={pageNum === pastMonthsPage}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setPastMonthsPage(pageNum);
                                    }}
                                  >
                                    {pageNum}
                                  </PaginationLink>
                                </PaginationItem>
                              ))}
                              <PaginationItem>
                                <PaginationNext
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setPastMonthsPage((p) => Math.min(totalPages, p + 1));
                                  }}
                                  className={pastMonthsPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                                />
                              </PaginationItem>
                            </PaginationContent>
                          </Pagination>
                        </div>
                      </>
                    );
                  })()}
                </>
              )}
            </>
          )}
        </HabitSection>
      </div>
    </div>
>>>>>>> c0b67fc (Habit Tracking Page base)
  );
}
