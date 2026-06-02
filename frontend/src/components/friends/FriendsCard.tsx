import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import FriendsItemCard from './FriendsItemCard';
import { User } from '@/types';
interface FriendsCardProps {
  friends: User[];
}

export default function FriendsCard({ friends }: FriendsCardProps) {
  return (
    <Card className="h-full w-full">
      <div className="flex items-center">
        <p className="ml-6 truncate text-lg">Current Friends</p>
        <Input placeholder="Enter friend name" className="mt-2 mr-6 ml-auto h-[4vh] w-[25vw]" />
      </div>
      <div className="mt-4 mr-4 mb-4 ml-4 flex grid gap-4 overflow-y-auto md:grid-cols-2">
        {friends.map((friend) => (
          <FriendsItemCard key={friend.sub} friend={friend} />
        ))}
      </div>
    </Card>
  );
}
