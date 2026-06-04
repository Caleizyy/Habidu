import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { profileApi } from '@/api/profile';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileDetails } from '@/components/profile/ProfileDetails';
import { ProfileEditActions } from '@/components/profile/ProfileEditActions';

export function ProfilePage() {
  const { user, isAuthenticated, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bio, setBio] = useState(user?.bio ?? '');
  const [displayName, setDisplayName] = useState(user?.name ?? '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

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
    } catch {
      setError('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setDisplayName(user?.name ?? '');
    setBio(user?.bio ?? '');
    setError(null);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-1 flex-col items-center px-6 py-12">
      <div className="w-full max-w-2xl space-y-6">
        <ProfileHeader user={user} isEditing={isEditing} onEditClick={handleEdit} />

        <ProfileDetails
          isEditing={isEditing}
          isLoading={isLoading}
          error={error}
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
