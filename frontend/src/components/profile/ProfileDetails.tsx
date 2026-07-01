import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Separator } from '@/components/ui/Separator';
import { Mail } from 'lucide-react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Profile } from '@/types/index';

interface ProfileDetailsProps {
  isEditing: boolean;
  isLoading: boolean;
  error: string | null;
  name: string;
  email: string;
  bio: string;
  displayName: string;
  user: Profile | null;
  onDisplayNameChange: (value: string) => void;
  onBioChange: (value: string) => void;
}

export function ProfileDetails({
  isEditing,
  isLoading,
  error,
  name,
  email,
  bio,
  displayName,
  user,
  onDisplayNameChange,
  onBioChange,
}: ProfileDetailsProps) {
  if (isLoading && !name) {
    return <p className="flex justify-center truncate text-sm">Loading profile...</p>;
  }
  if (error) {
    return (
      <div className="flex gap-2 rounded-md border border-red-200 bg-red-50 p-3">
        <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
        <p className="text-sm text-red-700">{error}</p>
      </div>
    );
  }
  if (!user) return null;
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Account Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Name field */}
        <div className="flex items-center gap-4">
          <Avatar className="h-24 w-24 text-2xl">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          {isEditing ? (
            <div className="relative">
              <Input
                id="name"
                value={displayName}
                onChange={(e) => onDisplayNameChange(e.target.value)}
                placeholder="Your display name"
                disabled={isLoading}
              />
              {isLoading && (
                <Loader2 className="text-muted-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 animate-spin" />
              )}
            </div>
          ) : (
            <p className="text-2xl font-semibold">{name}</p>
          )}
        </div>

        <Separator />

        {/* Email field (read-only) */}
        <div className="space-y-1">
          <Label className="text-muted-foreground flex items-center gap-2">
            <Mail className="h-[2vh] w-[1vw]" /> Email
          </Label>
          <p className="text-sm font-medium">{email ?? '—'}</p>
          <p className="text-muted-foreground text-xs">Email is managed by Google and cannot be changed here.</p>
        </div>

        <Separator />

        {/* Bio field */}
        <div className="space-y-1">
          <Label htmlFor="bio" className="text-muted-foreground">
            Bio
          </Label>
          {isEditing ? (
            <div className="relative">
              <Input
                id="bio"
                value={bio}
                onChange={(e) => onBioChange(e.target.value)}
                placeholder="Tell others a bit about yourself..."
                disabled={isLoading}
              />
              {isLoading && (
                <Loader2 className="text-muted-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 animate-spin" />
              )}
            </div>
          ) : (
            <p className="text-sm font-medium">
              {bio || <span className="text-muted-foreground italic">No bio yet.</span>}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
