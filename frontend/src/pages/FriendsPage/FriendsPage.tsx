import { friendsApi } from '@/api/friends';
import FriendsCard from '@/components/friends/FriendsCard';
import { Friend } from '@/types';
import { PageLayout } from '@/components/layout/PageLayout';
import { useState, useEffect } from 'react';
import FriendRequestCard from '@/components/friendRequests/FriendRequestCard';

export function FriendsPage() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  useEffect(() => {
    friendsApi
      .getFriends()
      .then((data) => setFriends(data))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [refreshKey]);

  const handleFriendRemoved = () => setRefreshKey((prev) => prev + 1);

  return (
    <PageLayout title="Friends">
      <div className="flex min-h-screen flex-col">
        <div className="mx-12 mt-12 flex min-w-0 flex-col gap-8 md:flex-row">
          {isLoading && <p className="flex justify-center truncate text-sm">Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!isLoading && !error && <FriendsCard friends={friends} onFriendRemoved={handleFriendRemoved} />}
          <FriendRequestCard />
        </div>
      </div>
    </PageLayout>
  );
}
