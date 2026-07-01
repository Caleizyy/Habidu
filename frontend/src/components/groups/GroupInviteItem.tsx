import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Friend } from '@/types/index';
import { initials } from '@/utils/initials';
import { Link, generatePath } from 'react-router-dom';
import { ROUTES } from '@/constants/Routes.constants';

interface Props {
  friend: Friend;
  inviting: boolean;
  onInvite: () => void;
}

export function GroupInviteItem({ friend, inviting, onInvite }: Props) {
  const name = `${friend.firstName} ${friend.lastName}`;
  return (
    <li className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Link to={generatePath(ROUTES.PROFILE, { userId: friend._id })}>
          <Avatar size="sm" className="cursor-pointer transition-opacity hover:opacity-80">
            <AvatarImage src={friend.avatar} alt={name} />
            <AvatarFallback>{initials(name)}</AvatarFallback>
          </Avatar>
        </Link>
        <div>
          <p className="text-sm font-medium">{name}</p>
          <p className="text-muted-foreground text-xs">{friend.email}</p>
        </div>
      </div>
      <Button size="sm" variant="outline" disabled={inviting} onClick={onInvite}>
        {inviting ? 'Adding…' : 'Add'}
      </Button>
    </li>
  );
}
