import { Card } from '@/components/ui/Card';
import AcceptGroupRequestCardItem from './AcceptGroupRequestCardItem';
import { GroupInvite } from '@/types/groupInvites';

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
      <div className="mt-4 mr-4 mb-4 ml-4 grid gap-4">
        {display.map((entry) => (
          <AcceptGroupRequestCardItem key={entry._id} group={entry} onGroupAction={onGroupAction} />
        ))}
      </div>
    </Card>
  );
}
