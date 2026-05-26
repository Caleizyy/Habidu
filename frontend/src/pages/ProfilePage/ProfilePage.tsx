import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { profileApi } from '@/api/profile';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileDetails } from '@/components/profile/ProfileDetails';
import { ProfileEditActions } from '@/components/profile/ProfileEditActions';

export function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(user?.bio ?? '');
  const [displayName, setDisplayName] = useState(user?.name ?? '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setDisplayName(user.name ?? '');
      setBio(user.bio ?? '');
    }
  }, [user]);

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
    } catch {
      setError('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setDisplayName(user?.name ?? '');
    setBio('');
    setError(null);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-1 flex-col items-center px-6 py-12">
      <div className="w-full max-w-2xl space-y-6">
        <ProfileHeader user={user} isEditing={isEditing} onEditClick={() => setIsEditing(true)} />

        <ProfileDetails
          isEditing={isEditing}
          name={user?.name ?? ''}
          email={user?.email ?? ''}
          bio={bio}
          displayName={displayName}
          onDisplayNameChange={setDisplayName}
          onBioChange={setBio}
        />

        {isEditing && (
          <ProfileEditActions isSaving={isSaving} error={error} onSave={handleSave} onCancel={handleCancel} />
        )}
      </div>
    </div>
  );
}
