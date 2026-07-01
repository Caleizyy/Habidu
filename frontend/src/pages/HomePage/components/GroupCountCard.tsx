import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { CirclePile } from 'lucide-react';

interface GroupCountCardProps {
  groupCount: number;
}

export function GroupCountCard({ groupCount }: GroupCountCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Groups</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center gap-2 py-2">
          <span className="text-5xl">{groupCount}</span>
          <CirclePile className="h-10 w-10" />
        </div>
      </CardContent>
    </Card>
  );
}
