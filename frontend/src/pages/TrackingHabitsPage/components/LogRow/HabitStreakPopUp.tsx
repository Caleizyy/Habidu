import * as React from 'react';
import { Flame, Star } from 'lucide-react';
import ReactDOM from 'react-dom';

export interface HabitStreakPopUpProps {
  currentStreak: number;
  personalBest: number;
  visible: boolean;
  triggerRef: React.RefObject<HTMLDivElement | null>;
}

function HabitStreakPopUp({ currentStreak, personalBest, visible, triggerRef }: HabitStreakPopUpProps) {
  const [tooltipPosition, setTooltipPosition] = React.useState({ top: 0, left: 0 });

  React.useEffect(() => {
    if (visible && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setTooltipPosition({
        top: rect.top - 60, // Position above with gap
        left: rect.left + rect.width / 2,
      });
    }
  }, [visible, triggerRef]);

  return ReactDOM.createPortal(
    <div
      className="pointer-events-none fixed transition-opacity duration-500"
      style={{
        top: `${tooltipPosition.top}px`,
        left: `${tooltipPosition.left}px`,
        transform: 'translateX(-50%)',
        opacity: visible ? 1 : 0,
      }}
    >
      <div className="rounded-lg border border-neutral-200 bg-white px-3 py-2 shadow-xl dark:border-neutral-300 dark:bg-neutral-100">
        <div className="flex items-center gap-4 whitespace-nowrap">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 fill-orange-500 text-orange-500" />
            <span className="text-sm font-semibold text-orange-600">{currentStreak}</span>
          </div>

          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
            <span className="text-sm font-semibold text-amber-600">{personalBest}</span>
          </div>
        </div>

        <div className="absolute top-full left-1/2 -translate-x-1/2 transform">
          <div className="border-4 border-transparent border-t-white dark:border-t-neutral-100" />
        </div>
      </div>
    </div>,
    document.body
  );
}

export default HabitStreakPopUp;
