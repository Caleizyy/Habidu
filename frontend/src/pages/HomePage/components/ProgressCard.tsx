import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface ProgressCardProps {
  title: string;
  completed: number;
  total: number;
  periodLabel: string;
}

export function ProgressCard({ title, completed, total, periodLabel }: ProgressCardProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const isComplete = completed === total && total > 0;

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-900 dark:text-neutral-100">Habits for {periodLabel}</span>
            <span
              className={`text-4xl font-bold ${
                isComplete ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'
              }`}
            >
              {completed}/{total}
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
            <div
              className={`h-full transition-all duration-300 ${isComplete ? 'bg-green-500' : 'bg-amber-300'}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
