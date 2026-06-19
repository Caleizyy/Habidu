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
      <div className="flex h-screen flex-1 flex-col">
        <div className="mt-12 mr-12 ml-12 flex min-w-0 gap-8">
          {isLoading && <p className="flex justify-center truncate text-sm">Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!isLoading && !error && <FriendsCard friends={friends} onFriendRemoved={handleFriendRemoved} />}
          <FriendRequestCard />
        </div>
      </div>
    </PageLayout>
  );
}
