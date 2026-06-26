import { Card, CardContent } from '@/components/ui/Card';
import { Flame, Star } from 'lucide-react';

interface StreaksCardProps {
  dailyStreak: number;
  dailyPB: number;
  weeklyStreak: number;
  weeklyPB: number;
  monthlyStreak: number;
  monthlyPB: number;
}

export function StreaksCard({
  dailyStreak,
  dailyPB,
  weeklyStreak,
  weeklyPB,
  monthlyStreak,
  monthlyPB,
}: StreaksCardProps) {
  const streaks = [
    { label: 'Daily', current: dailyStreak, best: dailyPB },
    { label: 'Weekly', current: weeklyStreak, best: weeklyPB },
    { label: 'Monthly', current: monthlyStreak, best: monthlyPB },
  ];

  return (
    <Card>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-700">
                <th className="py-2 text-left text-base text-neutral-900 dark:text-neutral-100">Frequency</th>
                <th className="px-4 py-2 text-center text-base text-neutral-900 dark:text-neutral-100">
                  <div className="flex items-center justify-center gap-1">
                    <Flame className="h-5 w-5 fill-orange-500 text-orange-500" />
                    Current Streak
                  </div>
                </th>
                <th className="px-4 py-2 text-center text-base text-neutral-900 dark:text-neutral-100">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                    Personal Best
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {streaks.map((streak, index) => (
                <tr
                  key={streak.label}
                  className={`${index !== streaks.length - 1 ? 'border-b border-neutral-100 dark:border-neutral-800' : ''}`}
                >
                  <td className="text-sm text-neutral-900 dark:text-neutral-100">{streak.label}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="px-3 py-1 text-2xl font-bold text-orange-600 dark:bg-orange-950/30 dark:text-orange-400">
                      {streak.current}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="px-3 py-1 text-2xl font-bold text-amber-600 dark:bg-amber-950/30 dark:text-amber-400">
                      {streak.best}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
