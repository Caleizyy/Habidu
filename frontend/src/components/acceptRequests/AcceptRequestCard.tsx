import { Card } from '@/components/ui/Card';
import AcceptRequestCardItem from './AcceptRequestCardItem';
import { FriendRequest } from '@/types';

interface AcceptRequestCardProps {
  display: FriendRequest[];
  functionality: string;
  onFriendAction: () => void;
}

export default function AcceptRequestCard({ display, functionality, onFriendAction }: AcceptRequestCardProps) {
  return (
    <Card className="h-full w-full">
      <div className="flex items-center">
        <p className="ml-6 truncate text-lg">{functionality} requests</p>
      </div>
      <div className="mt-4 mr-4 mb-4 ml-4 flex grid gap-4 overflow-y-auto md:grid-cols-2">
        {display.map((entry) => (
          <AcceptRequestCardItem key={entry._id} request={entry} onFriendAction={onFriendAction} />
        ))}
      </div>
    </Card>
  );
}
