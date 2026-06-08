import { Card } from '@/components/ui/Card';
import { User } from '@/types';
import { AvatarFallback, Avatar, AvatarImage } from '../ui/Avatar';
import kittenImage from '../../assets/kitten.jpg';

export default function FriendsItemCard({ friend }: { friend: User }) {
  return (
    <div className="flex h-[15vh]">
      <Card className="h-full w-full">
        <div className="flex h-full w-full items-center">
          <Avatar className="ml-6 h-[8vh] w-[8vh]">
            <AvatarImage src={friend?.avatar || kittenImage} alt="Avatar" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="mx-6 flex min-w-0 flex-1 flex-col gap-2 py-2">
            <Card className="flex items-center justify-center bg-gray-300 p-1">
              <p className="truncate text-lg">{friend.name}</p>
            </Card>
            <Card className="flex items-center justify-center bg-gray-100 p-1">
              <p className="truncate text-lg">{friend.email}</p>
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
}
