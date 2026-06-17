import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { User } from '@/types/index';
import { initials } from '@/utils/initials';

interface Props {
  user: User;
  inviting: boolean;
  onInvite: () => void;
}

export function GroupInviteItem({ user, inviting, onInvite }: Props) {
  return (
    <li className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Avatar size="sm">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{initials(user.name)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">{user.name}</p>
          <p className="text-muted-foreground text-xs">{user.email}</p>
        </div>
      </div>
      <Button size="sm" variant="outline" disabled={inviting} onClick={onInvite}>
        {inviting ? 'Adding…' : 'Add'}
      </Button>
    </li>
  );
}
