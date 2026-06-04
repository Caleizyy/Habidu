import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Separator } from '@/components/ui/Separator';
import { Mail, User } from 'lucide-react';
import { AlertCircle, Loader2 } from 'lucide-react';

interface ProfileDetailsProps {
  isEditing: boolean;
  isLoading: boolean;
  error: string | null;
  name: string;
  email: string;
  bio: string;
  displayName: string;
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
  onDisplayNameChange,
  onBioChange,
}: ProfileDetailsProps) {
  if (isLoading && !name) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Account Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Error message */}
          {error && (
            <div className="flex gap-2 rounded-md border border-red-200 bg-red-50 p-3">
              <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          {/* Name field */}
          <div className="space-y-1">
            <Label htmlFor="name" className="text-muted-foreground flex items-center gap-2">
              <User className="h-[20vh] w-[20vw]" /> Display Name
            </Label>
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
}
