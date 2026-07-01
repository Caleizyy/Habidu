import { Card } from '@/components/ui/Card';
import FriendsItemCard from './FriendsItemCard';
import { Friend } from '@/types';
import friendsEmpty from '@/assets/multiple-users-silhouette.png';

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
        {friends.length === 0 && (
          <div className="text-center">
            <img src={friendsEmpty} className="mx-auto flex size-30"></img>
            <p className="mb-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">No friends yet..</p>
          </div>
        )}
      </div>
    </Card>
  );
}
