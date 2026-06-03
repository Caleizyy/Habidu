import { friendsApi } from '@/api/friends';
import FriendsCard from '@/components/friends/FriendsCard';
import { User } from '@/types';
import * as React from 'react';
import { useState, useEffect } from 'react';
import FriendRequestCard from '@/components/friendRequests/FriendRequestCard';

export function FriendsPage(): React.ReactNode {
  const [friends, setFriends] = useState<User[]>([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    friendsApi
      .getFriends()
      .then((data) => setFriends(data))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="flex h-screen flex-1 flex-col">
      <div className="flex flex-row items-center justify-between">
        <h1 className="mt-12 ml-12 flex justify-start text-6xl text-black">Friends</h1>
      </div>
      <div className="mt-12 mr-12 ml-12 flex min-w-0 gap-8">
        {isLoading && <p className="flex justify-center truncate text-sm">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!isLoading && !error && <FriendsCard friends={friends} />}
        <FriendRequestCard />
      </div>
    </div>
  );
}
