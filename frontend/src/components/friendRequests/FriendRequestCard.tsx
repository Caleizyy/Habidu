import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { User } from '@/types';
import FriendRequestItemCard from './FriendRequestCardItem';
import { friendsApi } from '@/api/friends';
import { useState } from 'react';

export default function FriendRequestCard() {
  const [friendRequests, setFriendRequests] = useState<User[]>([]);
  const [defaultText, setDefaultText] = useState('Type in an email above to send a friend request');
  const [error, setError] = useState(null);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    debounce(fetchFriendRequests, import.meta.env.VITE_DEBOUNCE_DELAY)(value);
  };

  const fetchFriendRequests = (query: string) => {
    friendsApi
      .getRequestSearch(query)
      .then((data) => {
        if (data.length > 0) {
          setFriendRequests(data);
        } else {
          setDefaultText('No users found with that email');
        }
        setError(null);
      })
      .catch((error) => setError(error.message))
      .finally(() => setIsLoading(false));
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
          friendRequests.map((friendRequests) => (
            <FriendRequestItemCard key={friendRequests.sub} friend={friendRequests} />
          ))
        ) : (
          <p className="flex justify-center truncate text-sm text-gray-500">{defaultText}</p>
        )}
      </div>
    </Card>
  );
}
