import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
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
  const { userId } = useParams<{ userId?: string }>();
  const isOwnProfile = !userId;

  const { user: authUser, isAuthenticated, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(isOwnProfile && !authUser);
  const [bio, setBio] = useState(authUser?.bio ?? '');
  const [displayName, setDisplayName] = useState(`${authUser?.firstName} ${authUser?.lastName}`);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    data: fetchedUser,
    isLoading: fetchLoading,
    error: fetchError,
  } = useQuery({
    queryKey: ['profile', userId],
    queryFn: () => profileApi.getProfile(userId!),
    enabled: !!userId,
  });

  useEffect(() => {
    if (userId || authUser) return;
    refreshUser()
      .catch((err) => {
        setError('Failed to load profile. Please refresh the page.');
        console.error(err);
      })
      .finally(() => setIsLoading(false));
  }, [userId, authUser, refreshUser]);

  if (!isAuthenticated) return null;

  if (isOwnProfile && !authUser) {
    return <div>{error ?? 'Failed to load profile data'}</div>;
  }

  const user = isOwnProfile ? authUser : fetchedUser;

  const handleEdit = () => {
    setDisplayName(authUser?.name ?? '');
    setBio(authUser?.bio ?? '');
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
    setDisplayName(`${authUser?.firstName} ${authUser?.lastName}`);
    setBio(authUser?.bio ?? '');
    setError(null);
    setIsEditing(false);
  };

  return (
    <PageLayout
      title="Profile"
      actions={
        isOwnProfile &&
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
            isEditing={isOwnProfile && isEditing}
            isLoading={isOwnProfile ? isLoading : fetchLoading}
            error={isOwnProfile ? error : fetchError ? 'Failed to load profile. Please try again.' : null}
            name={user?.name ?? ''}
            email={user?.email ?? ''}
            bio={isOwnProfile ? bio : (user?.bio ?? '')}
            displayName={isOwnProfile ? displayName : (user?.name ?? '')}
            user={user ?? null}
            onDisplayNameChange={setDisplayName}
            onBioChange={setBio}
          />

          {isOwnProfile && isEditing && (
            <ProfileEditActions isSaving={isSaving} error={error} onSave={handleSave} onCancel={handleCancel} />
          )}
        </div>
      </div>
    </PageLayout>
  );
}
