import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export interface GroupProgress {
  groupId: string;
  groupName: string;
  grandTotal: number;
  targetValue: number;
  targetUnit: string;
}

interface GroupProgressCardProps {
  groups: GroupProgress[];
}

export function GroupProgressCard({ groups }: GroupProgressCardProps) {
  if (groups.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Group Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">No group habits set up yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Group Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {groups.map(({ groupId, groupName, grandTotal, targetValue, targetUnit }) => {
          const percentage = targetValue > 0 ? Math.min(Math.round((grandTotal / targetValue) * 100), 100) : 0;
          const isComplete = grandTotal >= targetValue && targetValue > 0;
          return (
            <div key={groupId} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="truncate text-sm text-neutral-900 dark:text-neutral-100">{groupName}</span>
                <span
                  className={`ml-2 shrink-0 text-sm font-semibold tabular-nums ${
                    isComplete ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'
                  }`}
                >
                  {grandTotal}/{targetValue} {targetUnit}
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
                <div
                  className={`h-full transition-all duration-300 ${isComplete ? 'bg-green-500' : 'bg-amber-300'}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
