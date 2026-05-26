import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Separator } from '@/components/ui/Separator';
import { Mail, User } from 'lucide-react';

interface ProfileDetailsProps {
  isEditing: boolean;
  name: string;
  email: string;
  bio: string;
  displayName: string;
  onDisplayNameChange: (value: string) => void;
  onBioChange: (value: string) => void;
}

export function ProfileDetails({
  isEditing,
  name,
  email,
  bio,
  displayName,
  onDisplayNameChange,
  onBioChange,
}: ProfileDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Account Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Name field */}
        <div className="space-y-1">
          <Label htmlFor="name" className="text-muted-foreground flex items-center gap-2">
            <User className="h-4 w-4" /> Display Name
          </Label>
          {isEditing ? (
            <Input
              id="name"
              value={displayName}
              onChange={(e) => onDisplayNameChange(e.target.value)}
              placeholder="Your display name"
            />
          ) : (
            <p className="text-sm font-medium">{name ?? '—'}</p>
          )}
        </div>

        <Separator />

        {/* Email field (read-only) */}
        <div className="space-y-1">
          <Label className="text-muted-foreground flex items-center gap-2">
            <Mail className="h-4 w-4" /> Email
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
            <Input
              id="bio"
              value={bio}
              onChange={(e) => onBioChange(e.target.value)}
              placeholder="Tell others a bit about yourself..."
            />
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
