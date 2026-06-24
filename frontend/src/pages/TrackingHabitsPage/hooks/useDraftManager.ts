import * as React from 'react';

export function useDraftManager() {
  const [drafts, setDrafts] = React.useState<Record<string, Record<string, number>>>({});
  const [deletedLogIds, setDeletedLogIds] = React.useState<Record<string, string>>({});

  const addLog = React.useCallback((habitId: string, value: number, date: string) => {
    setDrafts((prev) => ({
      ...prev,
      [habitId]: { ...(prev[habitId] ?? {}), [date]: value },
    }));
  }, []);

  const editLog = React.useCallback((habitId: string, date: string, newValue: number) => {
    setDrafts((prev) => ({
      ...prev,
      [habitId]: { ...(prev[habitId] ?? {}), [date]: newValue },
    }));
  }, []);

  const markLogForDeletion = React.useCallback((logId: string, habitId: string) => {
    setDeletedLogIds((prev) => ({
      ...prev,
      [logId]: habitId,
    }));
  }, []);

  const undoDraft = React.useCallback((habitId: string, date: string) => {
    setDrafts((prev) => {
      const habitDrafts = { ...prev[habitId] };
      delete habitDrafts[date];
      // If habit has no more drafts, remove habitId entirely
      if (Object.keys(habitDrafts).length === 0) {
        const { [habitId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [habitId]: habitDrafts };
    });
  }, []);

  const clearAllDrafts = React.useCallback(() => {
    setDrafts({});
    setDeletedLogIds({});
  }, []);

  const hasUnsavedChanges = React.useMemo(() => {
    return (
      Object.values(drafts).some((habitDrafts) => Object.keys(habitDrafts).length > 0) ||
      Object.keys(deletedLogIds).length > 0
    );
  }, [drafts, deletedLogIds]);

  return {
    drafts,
    deletedLogIds,
    addLog,
    editLog,
    markLogForDeletion,
    undoDraft,
    clearAllDrafts,
    hasUnsavedChanges,
  };
}
