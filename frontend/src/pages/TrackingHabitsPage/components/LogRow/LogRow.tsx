import { useState, useRef, useEffect } from 'react';
import HabitStreakPopUp from './HabitStreakPopUp';
import LogRowProgress from './LogRowProgress';
import LogRowActions from './LogRowActions';
import LogRowStatus from './LogRowStatus';
import LogRowPeriodLabel from './LogRowLabel';
import LogRowInput from './LogRowInput';

export interface LogRowProps {
  periodLabel: string;
  periodSublabel?: string;
  value: number;
  target: number;
  unit: string;
  isCurrentPeriod?: boolean;
  currentStreak?: number;
  personalBest?: number;
  // called when user taps "Log" — client sends quickLog:true, value:targetValue
  onQuickLog: () => void;
  // called when user manually edits — client sends quickLog:false, value:N
  onEdit: (value: number) => void;
  // called when user clicks "Undo" to delete the log entry
  onUndo: () => void;
  isPopupOpen?: boolean;
  onPopupToggle?: () => void;
}

export function LogRow({
  periodLabel,
  periodSublabel,
  value,
  target,
  unit,
  isCurrentPeriod,
  currentStreak = 0,
  personalBest = 0,
  onQuickLog,
  onEdit,
  onUndo,
  isPopupOpen = false,
  onPopupToggle,
}: LogRowProps) {
  const [draftValue, setDraftValue] = useState<number>(value);
  const prevValueRef = useRef(value);
  const [showBadge, setShowBadge] = useState(false);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const circleRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    hoverTimerRef.current = setTimeout(() => {
      setShowBadge(true);
    }, 1000); // 1 second delay
  };

  const handleRowClick = (e: React.MouseEvent) => {
    // Don't toggle if clicking on interactive elements
    if ((e.target as HTMLElement).closest('button, input')) {
      return;
    }
    onPopupToggle?.();
  };

  const handleDraftChange = (newValue: number) => {
    setDraftValue(newValue);
    onEdit(newValue);
  };

  const handleMouseLeave = () => {
    setShowBadge(false);
    if (isPopupOpen) {
      onPopupToggle?.();
    }
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowBadge(false);
      if (isPopupOpen) {
        onPopupToggle?.();
      }
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
        hoverTimerRef.current = null;
      }
    };
    window.addEventListener('scroll', handleScroll, { capture: true, passive: true });
    return () => window.removeEventListener('scroll', handleScroll, { capture: true });
  }, [isPopupOpen, onPopupToggle]);

  useEffect(() => {
    // Only reset draft if value changed externally (e.g., via undo)
    if (value !== prevValueRef.current) {
      setDraftValue(value);
      prevValueRef.current = value;
    }
  }, [value]);

  const taskProgress = (value / target) * 100;

  const isCompleted = value >= target && target > 0;
  const isOver = value > target;
  const ratio = target === 0 ? 0 : Math.min(value / target, 1);

  return (
    <div
      className={`items-left flex w-full items-center gap-3 border-b border-neutral-100 px-4 text-left transition-colors last:border-b-0 dark:border-neutral-800 ${isCurrentPeriod ? 'bg-neutral-50 py-4 dark:bg-neutral-800/60' : 'py-3'} `}
      onClick={handleRowClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div ref={circleRef} className="flex shrink-0">
        <LogRowStatus isCompleted={isCompleted} isCurrentPeriod={isCurrentPeriod} ratio={ratio} />
      </div>

      <HabitStreakPopUp
        currentStreak={currentStreak}
        personalBest={personalBest}
        visible={showBadge || isPopupOpen}
        triggerRef={circleRef}
      />

      <LogRowPeriodLabel periodLabel={periodLabel} periodSublabel={periodSublabel} isCurrentPeriod={isCurrentPeriod} />

      <LogRowProgress progress={taskProgress} />

      <div className="flex shrink-0 items-center gap-2" onClick={(e) => e.stopPropagation()}>
        <LogRowInput draftValue={draftValue} unit={unit} onChange={handleDraftChange} />

        <LogRowActions
          isCompleted={isCompleted}
          isOver={isOver}
          quickLog={onQuickLog}
          undoLog={onUndo}
          value={value - target}
          unit={unit}
        />
      </div>
    </div>
  );
}
