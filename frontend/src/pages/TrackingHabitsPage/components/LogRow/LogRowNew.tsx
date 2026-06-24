import { useState, useRef, useEffect } from 'react';
import { HabitStreakPopUp } from '../HabitStreakPopUp';
import { Input } from '@/components/ui/Input';
import LogRowProgress from './LogRowProgress';
import { Button } from '@/components/ui/Button';
import LogRowActions from './LogRowActions';

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
  const [editing, setEditing] = useState(false);
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

  const confirmEdit = () => {
    onEdit(draftValue);
  };

  const handleMouseLeave = () => {
    setShowBadge(false);
    if (isPopupOpen) {
      onPopupToggle?.();
    }
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.currentconfirmEdit = null;
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
      setEditing(false);
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
      {/* Status circle */}
      <div
        ref={circleRef}
        className={`flex shrink-0 items-center justify-center rounded-full transition-all ${
          isCompleted
            ? 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400'
            : 'bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500'
        } ${isCurrentPeriod ? 'h-9 w-9' : 'h-7 w-7'}`}
      >
        {isCompleted ? (
          <svg className={isCurrentPeriod ? 'h-5 w-5' : 'h-4 w-4'} viewBox="0 0 16 16" fill="none">
            <path
              d="M3 8l3.5 3.5L13 5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <span style={{ fontSize: isCurrentPeriod ? 10 : 9, fontFamily: 'monospace', fontWeight: 600 }}>
            {Math.round(ratio * 100)}%
          </span>
        )}
      </div>

      {/* Streak Pop Up */}
      <HabitStreakPopUp
        currentStreak={currentStreak}
        personalBest={personalBest}
        visible={showBadge || isPopupOpen}
        triggerRef={circleRef}
      />

      {/* Period label */}
      <div className="flex max-w-20 flex-col gap-0.5">
        <span
          className={`font-semibold text-neutral-800 dark:text-neutral-200 ${isCurrentPeriod ? 'text-base' : 'text-sm'}`}
        >
          {periodLabel}
        </span>
        {periodSublabel && <span className="text-xs text-neutral-400 dark:text-neutral-500">{periodSublabel}</span>}
      </div>

      <LogRowProgress progress={taskProgress} />

      {/* Value / edit / badge */}
      <div className="flex shrink-0 items-center gap-2" onClick={(e) => e.stopPropagation()}>
        {/* Editable value */}
        <div className="flex items-center gap-1">
          <Input
            type="number"
            autoFocus
            value={draftValue}
            onChange={(e) => {
              setDraftValue(parseFloat(e.target.value));
            }}
            onBlur={confirmEdit}
            className="w-14 rounded border border-neutral-300 bg-white px-1.5 py-0.5 text-xs text-neutral-800 outline-none focus:border-green-500 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-200"
          />
          <span className="text-xs text-neutral-400 dark:text-neutral-500">{unit}</span>
        </div>

        {/* Status badge */}
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

// interface LogInputProps {
//   draftValue: string;
//   onChange: (e: string) => void;
//   unit: string;
//   commitEdit: () => void;
// }

// const LogInput = ({ draftValue, onChange, unit, commitEdit }: LogInputProps) => {
//   const handleDraftChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     onChange(e.target.value);
//   };

//   return (
//     <div className="flex items-center gap-1">
//       <Input
//         autoFocus
//         value={draftValue}
//         onChange={handleDraftChange}
//         onBlur={commitEdit}
//         className="w-14 rounded border border-neutral-300 bg-white px-1.5 py-0.5 text-xs text-neutral-800 outline-none focus:border-green-500 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-200"
//       />
//       <span className="text-xs text-neutral-400 dark:text-neutral-500">{unit}</span>
//     </div>
//   );
// };
