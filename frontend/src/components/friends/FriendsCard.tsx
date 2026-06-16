import { Card } from '@/components/ui/Card';
import FriendsItemCard from './FriendsItemCard';
import { Friend } from '@/types';
interface FriendsCardProps {
  friends: Friend[];
  onFriendRemoved: () => void;
}

export default function FriendsCard({ friends, onFriendRemoved }: FriendsCardProps) {
  return (
    <Card className="h-full w-full">
      <div className="flex items-center">
        <p className="ml-6 truncate text-lg">Current Friends</p>
      </div>
      <div className="mt-4 mr-4 mb-4 ml-4 gap-4 overflow-y-auto">
        {friends.map((friend) => (
          <FriendsItemCard key={friend._id} friend={friend} onFriendRemoved={onFriendRemoved} />
        ))}
      </div>
    </Card>
  );
}
