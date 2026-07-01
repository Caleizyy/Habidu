import { Card } from '@/components/ui/Card';
import AcceptGroupRequestCardItem from './AcceptGroupRequestCardItem';
import { GroupInvite } from '@/types/groupInvites';
import emptyInbox from '@/assets/message.png';

interface AcceptGroupRequestCardProps {
  display: GroupInvite[];
  functionality: string;
  onGroupAction: () => void;
}

export default function AcceptGroupRequestCard({ display, functionality, onGroupAction }: AcceptGroupRequestCardProps) {
  return (
    <Card className="h-full w-full overflow-hidden">
      <div className="flex items-center">
        <p className="ml-6 truncate text-lg">{functionality} requests</p>
      </div>
      <div className="mt-4 mr-4 mb-4 ml-4 flex flex-col gap-4 overflow-y-auto">
        {display.map((entry) => (
          <AcceptGroupRequestCardItem key={entry._id} group={entry} onGroupAction={onGroupAction} />
        ))}
        {display.length === 0 && (
          <div className="text-center">
            <img src={emptyInbox} className="mx-auto flex size-30"></img>
            <p className="mt-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">No group invites yet..</p>
          </div>
        )}
      </div>
    </Card>
  );
}
