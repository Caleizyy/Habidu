import { Card } from '@/components/ui/Card';
import { Friend } from '@/types';
import { AvatarFallback, Avatar, AvatarImage } from '../ui/Avatar';
import kittenImage from '../../assets/kitten.jpg';
import { useState } from 'react';
import { friendRequestsApi } from '@/api/friendRequests';
import { X } from 'lucide-react';

export default function FriendsItemCard({ friend, onFriendRemoved }: { friend: Friend; onFriendRemoved: () => void }) {
  const [requestText, setRequestText] = useState('Remove friend');
  const [clicked, setClicked] = useState(false);

  function handleClick() {
    setClicked(true);
    setRequestText('Sending...');
    friendRequestsApi
      .deleteFriend(friend.friendRequestId)
      .then(() => {
        onFriendRemoved();
        setRequestText('Friend removed!');
      })
      .catch((error: Error) => {
        // TODO: add proper error communication when that is implemented
        setRequestText('Request failed');
      });
  }

  return (
    <div className="flex h-[15vh]">
      <Card className="h-full w-full">
        <div className="flex h-full w-full items-center">
          <Avatar className="ml-6 h-[8vh] w-[8vh]">
            <AvatarImage src={friend.avatar || kittenImage} alt="Avatar" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="mx-6 flex min-w-0 flex-1 flex-col gap-2 py-2">
            <Card className="flex items-center justify-center bg-gray-300 p-1">
              <p className="truncate text-lg">
                {friend.firstName} {friend.lastName}
              </p>
            </Card>
            <Card className="flex items-center justify-center bg-gray-100 p-1">
              <p className="truncate text-lg">{friend.email}</p>
            </Card>
          </div>
          <Card
            className={
              clicked
                ? 'pointer-events-none mr-6 ml-auto flex w-[30vh] items-center justify-center rounded-lg bg-red-300 p-1 opacity-50 transition-all duration-200'
                : 'mr-6 ml-auto flex w-[30vh] cursor-pointer items-center justify-center rounded-lg bg-red-200 px-4 py-2 transition-all duration-200 hover:-translate-y-1 hover:bg-red-400 hover:shadow-lg'
            }
            onClick={handleClick}
          >
            <div className="flex items-center gap-2">
              <X />
              <p className="truncate text-lg font-medium">{requestText}</p>
            </div>
          </Card>
        </div>
      </Card>
    </div>
  );
}
