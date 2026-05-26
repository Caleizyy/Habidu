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
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-black">My Profile</h1>
        {!isEditing && (
          <Button variant="outline" onClick={onEditClick}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Profile
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
