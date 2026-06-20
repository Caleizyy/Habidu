import AcceptRequestCard from '@/components/acceptRequests/AcceptRequestCard';
import { FriendRequest } from '@/types';
import { PageLayout } from '@/components/layout/PageLayout';
import { useState, useEffect } from 'react';
import { friendRequestsApi } from '@/api/friendRequests';

//delete mongoose

export function RequestsPage() {
  const [friendsRequests, setFriendsRequests] = useState<FriendRequest[]>([]);
  const [friendsError, setFriendsError] = useState<string | null>(null);
  const [isFriendsLoading, setIsFriendsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    friendRequestsApi
      .getRequests()
      .then((data) => setFriendsRequests(data))
      .catch((err) => setFriendsError(err.message))
      .finally(() => setIsFriendsLoading(false));
  }, [refreshKey]);

  const handleFriendAction = () => setRefreshKey((prev) => prev + 1);

  return (
    <PageLayout title="Requests">
      <div className="flex h-screen flex-1 flex-col">
        <div className="mt-12 mr-12 ml-12 flex min-w-0 gap-8">
          {isFriendsLoading && <p className="flex justify-center truncate text-sm">Loading...</p>}
          {friendsError && <p className="text-red-500">{friendsError}</p>}
          {!isFriendsLoading && !friendsError && (
            <AcceptRequestCard display={friendsRequests} functionality="Friend" onFriendAction={handleFriendAction} />
          )}
          {/* {isGroupsLoading && <p className="flex justify-center truncate text-sm">Loading...</p>}
        {groupsError && <p className="text-red-500">{groupsError}</p>}
        {!isGroupsLoading && !groupsError && <AcceptRequestCard display={groupsRequests} functionality="Group" />} */}
        </div>
      </div>
    </PageLayout>
  );
}
