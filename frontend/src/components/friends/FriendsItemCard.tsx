import { Card } from '@/components/ui/Card';
import { Friend } from '@/types';
import { AvatarFallback, Avatar, AvatarImage } from '../ui/Avatar';
import kittenImage from '../../assets/kitten.jpg';
import { useState } from 'react';
import { friendRequestsApi } from '@/api/friendRequests';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { toastSuccess, toastError } from '@/constants/ToastStyles.constants';

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
        toast.success('Friend removed', toastSuccess);
      })
      .catch((error: Error) => {
        // TODO: add proper error communication when that is implemented
        setRequestText('Request failed');
        toast.error('We were to remove your friend. Please try again', toastError);
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
                ? 'pointer-events-none mr-6 ml-auto flex h-10 w-10 items-center justify-center bg-red-200 p-1 opacity-50 transition-all duration-200 min-[800px]:h-auto min-[800px]:w-[30vh]'
                : 'mr-6 ml-auto flex h-10 w-10 cursor-pointer items-center justify-center bg-red-200 p-1 transition-all duration-200 hover:-translate-y-1 hover:bg-red-400 hover:shadow-lg min-[800px]:h-auto min-[800px]:w-[30vh]'
            }
            onClick={handleClick}
          >
            <X className="h-5 w-5 min-[800px]:hidden" />
            <p className="hidden truncate text-lg min-[800px]:block">{requestText}</p>
          </Card>
        </div>
      </Card>
    </div>
  );
}
