import { Card } from '@/components/ui/Card';
import { AvatarFallback, Avatar, AvatarImage } from '../ui/Avatar';
import kittenImage from '../../assets/kitten.jpg';
import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { toast } from 'sonner';
import { toastSuccess, toastError } from '@/constants/ToastStyles.constants';
import { groupRequestsApi } from '@/api/groupRequests';
import { GroupInvite } from '@/types/groupInvites';

export default function AcceptGroupRequestCardItem({
  group,
  onGroupAction,
}: {
  group: GroupInvite;
  onGroupAction: () => void;
}) {
  const [requestAcceptText, setRequestAcceptText] = useState('Accept invite');
  const [requestDenyText, setRequestDenyText] = useState('Deny invite');
  const [clicked, setClicked] = useState(false);

  function handleAccept() {
    groupRequestsApi
      .acceptGroupInvite(group._id)
      .then(() => {
        onGroupAction();
        setClicked(true);
        setRequestAcceptText('Invite accepted');
        setRequestDenyText('Invite accepted');
        toast.success('Your group invite was accepted successfully!', toastSuccess);
      })
      .catch(() => {
        setRequestAcceptText('Request failed');
        setRequestDenyText('Request failed');
        toast.error('We were unable to accept your group invite. Please try again', toastError);
      });
  }

  function handleDeny() {
    groupRequestsApi
      .declineGroupInvite(group._id)
      .then(() => {
        onGroupAction();
        setClicked(true);
        setRequestDenyText('Request denied');
        setRequestAcceptText('Request denied');
        toast.success('Group invite denied', toastSuccess);
      })
      .catch(() => {
        setRequestAcceptText('Request failed');
        setRequestDenyText('Request failed');
        toast.error('We were unable to deny your group invite. Please try again', toastError);
      });
  }

  return (
    <div className="flex w-full flex-col overflow-hidden md:flex-row">
      <Card className="h-full w-full">
        <div className="flex h-full w-full flex-col items-center md:flex-row">
          <Avatar className="ml-6 h-12 w-12">
            <AvatarImage src={group.inviter.avatar || kittenImage} alt="Avatar" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="mx-6 flex w-full min-w-0 flex-col gap-2 py-2 md:w-[40%]">
            <Card className="flex h-auto w-full items-center justify-center bg-gray-300 p-1">
              <p className="truncate text-lg">
                {group.inviter.firstName} {group.inviter.lastName}
              </p>
            </Card>
            <Card className="flex hidden h-auto w-full items-center justify-center bg-gray-100 p-1 md:flex">
              <p className="truncate text-lg">{group.inviter.email}</p>
            </Card>
          </div>
          <div className="mx-6 flex w-full min-w-0 flex-col gap-2 py-2 md:w-[40%]">
            <Card
              className={
                clicked
                  ? 'pointer-events-none flex w-full items-center justify-center rounded-lg bg-green-300 p-1 opacity-50 transition-all duration-200'
                  : 'flex w-full cursor-pointer items-center justify-center rounded-lg bg-green-200 px-4 py-2 transition-all duration-200 hover:-translate-y-1 hover:bg-green-400 hover:shadow-lg'
              }
              onClick={handleAccept}
            >
              <div className="flex items-center gap-2">
                <Check />
                <p className="hidden truncate text-lg font-medium md:inline">{requestAcceptText}</p>
              </div>
            </Card>
            <Card
              className={
                clicked
                  ? 'pointer-events-none flex w-full items-center justify-center rounded-lg bg-red-300 p-1 opacity-50 transition-all duration-200'
                  : 'flex w-full cursor-pointer items-center justify-center rounded-lg bg-red-200 px-4 py-2 transition-all duration-200 hover:-translate-y-1 hover:bg-red-400 hover:shadow-lg'
              }
              onClick={handleDeny}
            >
              <div className="flex items-center gap-2">
                <X />
                <p className="hidden truncate text-lg font-medium md:inline">{requestDenyText}</p>
              </div>
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
}
