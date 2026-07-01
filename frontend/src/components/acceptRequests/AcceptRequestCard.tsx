import { Card } from '@/components/ui/Card';
import AcceptRequestCardItem from './AcceptRequestCardItem';
import { FriendRequest } from '@/types';
import emptyFriends from '@/assets/group.png';

interface AcceptRequestCardProps {
  display: FriendRequest[];
  functionality: string;
  onFriendAction: () => void;
}

export default function AcceptRequestCard({ display, functionality, onFriendAction }: AcceptRequestCardProps) {
  return (
    <Card className="h-full w-full overflow-hidden">
      <div className="flex items-center">
        <p className="ml-6 truncate text-lg">{functionality} requests</p>
      </div>
      <div className="mt-4 mr-4 mb-4 ml-4 flex flex-col gap-4 overflow-y-auto">
        {display.map((entry) => (
          <AcceptRequestCardItem key={entry._id} request={entry} onFriendAction={onFriendAction} />
        ))}
        {display.length === 0 && (
          <div className="text-center">
            <img src={emptyFriends} className="mx-auto flex size-30"></img>
            <p className="mt-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">No group invites yet..</p>
          </div>
        )}
      </div>
    </Card>
  );
}
