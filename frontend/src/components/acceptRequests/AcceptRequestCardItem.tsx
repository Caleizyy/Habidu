import { Card } from '@/components/ui/Card';
import { AvatarFallback, Avatar, AvatarImage } from '../ui/Avatar';
import kittenImage from '../../assets/kitten.jpg';
import { useState } from 'react';
import { FriendRequest } from '@/types';
import { friendRequestsApi } from '@/api/friendRequests';
import { X, Check } from 'lucide-react';
import { toast } from 'sonner';
import { toastSuccess, toastError } from '@/constants/ToastStyles.constants';

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
        toast.success('Your friend request was accepted successfully!', toastSuccess);
      })
      .catch((error: Error) => {
        setRequestAcceptText('Request failed');
        setRequestDenyText('Request failed');
        toast.error('We were unable to accept your friend request. Please try again', toastError);
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
        toast.success('Friend request denied', toastSuccess);
      })
      .catch((error: Error) => {
        setRequestAcceptText('Request failed');
        setRequestDenyText('Request failed');
        toast.error('We were unable to deny your friend request. Please try again', toastError);
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
            <Card className="flex items-center justify-center bg-blue-300 p-1">
              <p className="truncate text-lg">
                {request.requesterId?.firstName} {request.requesterId?.lastName}
              </p>
            </Card>
            <Card className="flex items-center justify-center bg-blue-200 p-1">
              <p className="truncate text-lg">{request.requesterId?.email}</p>
            </Card>
          </div>
          <div className="ml-auto flex shrink-0 flex-col gap-2 py-2">
            <Card
              className={
                clicked
                  ? 'pointer-events-none mr-6 ml-auto flex h-10 w-10 items-center justify-center bg-green-100 p-1 opacity-50 transition-all duration-200 min-[800px]:h-auto min-[800px]:w-[30vh]'
                  : 'mr-6 ml-auto flex h-10 w-10 cursor-pointer items-center justify-center bg-green-100 p-1 transition-all duration-200 hover:-translate-y-1 hover:bg-green-300 hover:shadow-lg min-[800px]:h-auto min-[800px]:w-[30vh]'
              }
              onClick={handleAccept}
            >
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5" />
                <p className="hidden truncate text-lg min-[800px]:block">{requestAcceptText}</p>
              </div>
            </Card>
            <Card
              className={
                clicked
                  ? 'pointer-events-none mr-6 ml-auto flex h-10 w-10 items-center justify-center bg-red-100 p-1 opacity-50 transition-all duration-200 min-[800px]:h-auto min-[800px]:w-[30vh]'
                  : 'mr-6 ml-auto flex h-10 w-10 cursor-pointer items-center justify-center bg-red-100 p-1 transition-all duration-200 hover:-translate-y-1 hover:bg-red-300 hover:shadow-lg min-[800px]:h-auto min-[800px]:w-[30vh]'
              }
              onClick={handleDeny}
            >
              <div className="flex items-center gap-2">
                <X className="h-5 w-5" />
                <p className="hidden truncate text-lg min-[800px]:block">{requestDenyText}</p>
              </div>
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
}
