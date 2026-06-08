import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { User } from '@/types';
import FriendRequestItemCard from './FriendRequestCardItem';
import { friendsApi } from '@/api/friends';
import { useCallback, useRef, useState } from 'react';

export default function FriendRequestCard() {
  const [friendRequests, setFriendRequests] = useState<User[]>([]);
  const [defaultText, setDefaultText] = useState('Type in an email above to send a friend request');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const debounce = <T extends unknown[]>(callback: (...args: T) => void, delay: number) => {
    let timeoutTimer: ReturnType<typeof setTimeout>;

    return (...args: T) => {
      clearTimeout(timeoutTimer);
      setIsLoading(true);
      setError(null);

      timeoutTimer = setTimeout(() => {
        callback(...args);
      }, delay);
    };
  };

  const fetchFriendRequests = useCallback((query: string) => {
    friendsApi
      .getRequestSearch(query)
      .then((data) => {
        if (data.length > 0) {
          setFriendRequests(data);
          setDefaultText('Type in an email above to send a friend request');
        } else {
          setFriendRequests([]);
          setDefaultText('No users found. Try searching with a different email?');
        }
        setError(null);
      })
      .catch((error) => setError(error.message))
      .finally(() => setIsLoading(false));
  }, []);

  const debouncedFetch = useRef(debounce(fetchFriendRequests, 300));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    if (!value) {
      setFriendRequests([]);
      setDefaultText('Type in an email above to send a friend request');
      return;
    }
    debouncedFetch.current(value);
  };

  return (
    <Card className="h-full w-full">
      <div className="flex items-center">
        <p className="ml-6 truncate text-lg">Friend Requests</p>
        <Input
          placeholder="Enter someone's email"
          className="mt-2 mr-6 ml-auto h-[4vh] w-[25vw]"
          onChange={handleChange}
        />
      </div>
      <div className="mt-4 mr-4 mb-4 ml-4 flex flex-col gap-4 overflow-y-auto">
        {isLoading && <p className="flex justify-center truncate text-sm">Loading...</p>}
        {error && <p className="flex justify-center truncate text-sm text-red-500">{error}</p>}
        {!isLoading && !error && friendRequests.length > 0 ? (
          friendRequests.map((friendRequest) => (
            <FriendRequestItemCard key={friendRequest.sub} friend={friendRequest} />
          ))
        ) : (
          <p className="flex justify-center truncate text-sm text-gray-500">{defaultText}</p>
        )}
      </div>
    </Card>
  );
}
