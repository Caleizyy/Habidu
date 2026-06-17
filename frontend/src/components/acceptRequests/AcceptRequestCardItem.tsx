import { Card } from '@/components/ui/Card';
import { AvatarFallback, Avatar, AvatarImage } from '../ui/Avatar';
import kittenImage from '../../assets/kitten.jpg';
import { useState } from 'react';
import { FriendRequest } from '@/types';
import { friendRequestsApi } from '@/api/friendRequests';

export default function AcceptRequestCardItem({
  request,
  onFriendAction,
}: {
  request: FriendRequest;
  onFriendAction: () => void;
}) {
  const [requestAcceptText, setRequestAcceptText] = useState('Accept request');
  const [requestDenyText, setRequestDenyText] = useState('Deny request');
  const [clicked, setClicked] = useState(false);

  function handleAccept() {
    friendRequestsApi
      .acceptRequest(request._id)
      .then(() => {
        onFriendAction();
        setClicked(true);
        setRequestAcceptText('Request accepted');
        setRequestDenyText('Request accepted');
      })
      .catch((error: Error) => {
        setRequestAcceptText('Request failed');
        setRequestDenyText('Request failed');
      });
  }

  function handleDeny() {
    friendRequestsApi
      .declineRequest(request._id)
      .then(() => {
        onFriendAction();
        setClicked(true);
        setRequestDenyText('Request denied');
        setRequestAcceptText('Request denied');
      })
      .catch((error: Error) => {
        setRequestAcceptText('Request failed');
        setRequestDenyText('Request failed');
      });
  }

  return (
    <div className="flex h-[15vh]">
      <Card className="h-full w-full">
        <div className="flex h-full w-full items-center">
          <Avatar className="ml-6 h-[8vh] w-[8vh]">
            <AvatarImage src={request.requesterId?.avatar || kittenImage} alt="Avatar" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="mx-6 flex w-[40vh] min-w-0 flex-col gap-2 py-2">
            <Card className="flex items-center justify-center bg-gray-300 p-1">
              <p className="truncate text-lg">
                {request.requesterId?.firstName} {request.requesterId?.lastName}
              </p>
            </Card>
            <Card className="flex items-center justify-center bg-gray-100 p-1">
              <p className="truncate text-lg">{request.requesterId?.email}</p>
            </Card>
          </div>
          <div className="mx-6 flex w-[40vh] min-w-0 flex-col gap-2 py-2">
            <Card
              className={
                clicked
                  ? 'pointer-events-none flex items-center justify-center bg-gray-300 p-1 opacity-50'
                  : 'flex cursor-pointer items-center justify-center bg-gray-100 p-1'
              }
              onClick={handleAccept}
            >
              <p className="truncate text-lg">{requestAcceptText}</p>
            </Card>
            <Card
              className={
                clicked
                  ? 'pointer-events-none flex items-center justify-center bg-gray-300 p-1 opacity-50'
                  : 'flex cursor-pointer items-center justify-center bg-gray-100 p-1'
              }
              onClick={handleDeny}
            >
              <p className="truncate text-lg">{requestDenyText}</p>
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
}
