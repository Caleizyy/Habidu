import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Separator } from '@/components/ui/Separator';
import { Pencil } from 'lucide-react';
import { User } from '@/types/index';

interface ProfileHeaderProps {
  user: User | null;
  isEditing: boolean;
  onEditClick: () => void;
}

export function ProfileHeader({ user, isEditing, onEditClick }: ProfileHeaderProps) {
  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : '?';

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        {!isEditing && (
          <Button variant="outline" onClick={onEditClick} className="h-9 shrink-0 px-4">
            <Pencil className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Edit Profile</span>
          </Button>
        )}
      </div>

      <Separator />

      <Card>
        <CardContent className="flex items-center gap-6 pt-6">
          <Avatar className="h-24 w-24 text-2xl">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-2xl font-semibold">{user?.name ?? 'Unknown User'}</p>
            <p className="text-muted-foreground text-sm">{user?.email}</p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
