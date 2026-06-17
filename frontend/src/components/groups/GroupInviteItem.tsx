import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Friend } from '@/types/index';
import { initials } from '@/utils/initials';

interface Props {
  user: Friend;
  isPending: boolean;
  inviting: boolean;
  onInvite: () => void;
}

export function GroupInviteItem({ user, isPending, inviting, onInvite }: Props) {
  const name = `${user.firstName} ${user.lastName}`;
  return (
    <li className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Avatar size="sm">
          <AvatarImage src={user.avatar} alt={name} />
          <AvatarFallback>{initials(name)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">{name}</p>
          <p className="text-muted-foreground text-xs">{user.email}</p>
        </div>
      </div>
      <Button size="sm" variant="outline" disabled={inviting || isPending} onClick={onInvite}>
        {inviting ? 'Adding…' : isPending ? 'Pending' : 'Add'}
      </Button>
    </li>
  );
}
