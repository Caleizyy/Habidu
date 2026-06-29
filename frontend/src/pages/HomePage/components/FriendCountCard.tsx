import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Users } from 'lucide-react';

interface FriendCountCardProps {
  friendCount: number;
}

export function FriendCountCard({ friendCount }: FriendCountCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Friends</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center gap-2 py-2">
          <span className="text-5xl">{friendCount}</span>
          <Users className="h-10 w-10" />
        </div>
      </CardContent>
    </Card>
  );
}
