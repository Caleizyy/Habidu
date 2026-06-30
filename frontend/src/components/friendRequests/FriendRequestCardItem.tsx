import { Card } from '@/components/ui/Card';
import { User } from '@/types';
import { AvatarFallback, Avatar, AvatarImage } from '../ui/Avatar';
import kittenImage from '../../assets/kitten.jpg';
import { useState } from 'react';
import { Link, generatePath } from 'react-router-dom';
import { ROUTES } from '@/constants/Routes.constants';
import { friendsApi } from '@/api/friends';
import { toast } from 'sonner';
import { toastSuccess, toastError } from '@/constants/ToastStyles.constants';

export default function FriendRequestItemCard({ friend }: { friend: User }) {
  const [requestText, setRequestText] = useState('Send friend request');
  const [clicked, setClicked] = useState(false);

  function handleClick() {
    setClicked(true);
    setRequestText('Sending...');
    friendsApi
      .sendFriendRequest(friend.email)
      .then(() => {
        setRequestText('Friend request sent!');
        toast.success('Your friend request was sent successfully!', toastSuccess);
      })
      .catch((error: Error) => {
        // TODO: add proper error communication when that is implemented
        setRequestText('Request failed');
        toast.error('We were unable to send your friend request. Please try again', toastError);
      });
  }

  return (
    <div className="flex h-[15vh]">
      <Card className="h-full w-full">
        <div className="flex h-full w-full items-center">
          <Link to={generatePath(ROUTES.PROFILE, { userId: friend._id })} className="ml-6 shrink-0">
            <Avatar className="h-[8vh] w-[8vh] cursor-pointer transition-opacity hover:opacity-80">
              <AvatarImage src={friend.avatar || kittenImage} alt="Avatar" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Link>
          <div className="mx-6 flex w-[40vh] min-w-0 flex-col gap-2 py-2">
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
                ? 'pointer-events-none mr-6 ml-auto flex w-[30vh] items-center justify-center bg-gray-100 p-1 opacity-50'
                : 'mr-6 ml-auto flex w-[30vh] cursor-pointer items-center justify-center bg-gray-100 p-1'
            }
            onClick={handleClick}
          >
            <p className="truncate text-lg">{requestText}</p>
          </Card>
        </div>
      </Card>
    </div>
  );
}
