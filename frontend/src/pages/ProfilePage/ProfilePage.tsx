import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { profileApi } from '@/api/profile';
import { ProfileDetails } from '@/components/profile/ProfileDetails';
import { ProfileEditActions } from '@/components/profile/ProfileEditActions';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/Button';
import { Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { toastSuccess, toastError } from '@/constants/ToastStyles.constants';

export function ProfilePage() {
  const { user, isAuthenticated, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bio, setBio] = useState(user?.bio ?? '');
  const [displayName, setDisplayName] = useState(`${user?.firstName} ${user?.lastName}`);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) return;

    const loadUserData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        await refreshUser();
      } catch (err) {
        setError('Failed to load profile. Please refresh the page.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [user, refreshUser]);

  if (!isAuthenticated) {
    return null;
  }

  const handleEdit = () => {
    setDisplayName(user?.name ?? '');
    setBio(user?.bio ?? '');
    setError(null);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!displayName.trim()) {
      setError('Display name cannot be empty.');
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      await profileApi.updateProfile({ name: displayName.trim(), bio });
      await refreshUser();
      setIsEditing(false);
      toast.success('Your profile was saved successfully!', toastSuccess);
    } catch {
      setError('Failed to save changes. Please try again.');
      toast.error('We were unable to save your profile changes. Please try again', toastError);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setDisplayName(`${user?.firstName} ${user?.lastName}`);
    setBio(user?.bio ?? '');
    setError(null);
    setIsEditing(false);
  };

  if (!user) {
    setError('Failed to load user');
    return <div>Failed to load user</div>;
  }
  return (
    <PageLayout
      title="Profile"
      actions={
        !isEditing && (
          <Button
            variant="outline"
            onClick={handleEdit}
            className="h-9 shrink-0 px-4 transition-all duration-200 hover:-translate-y-1 hover:bg-gray-200 hover:shadow-lg"
          >
            <Pencil className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Edit Profile</span>
          </Button>
        )
      }
    >
      <div className="flex flex-1 flex-col items-center px-6 py-12">
        <div className="w-full max-w-2xl space-y-6">
          <ProfileDetails
            isEditing={isEditing}
            isLoading={isLoading}
            error={error}
            name={user.name}
            email={user.email}
            bio={bio ?? ''}
            displayName={displayName}
            user={user}
            onDisplayNameChange={setDisplayName}
            onBioChange={setBio}
          />

          {isEditing && (
            <ProfileEditActions isSaving={isSaving} error={error} onSave={handleSave} onCancel={handleCancel} />
          )}
        </div>
      </div>
    </PageLayout>
  );
}
