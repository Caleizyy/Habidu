import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/DropdownMenu';
import { notificationsApi } from '../../../api/notifications';
import { useState, useEffect } from 'react';
import { AppNotification } from '@/types';
import { Button } from '@/components/ui/Button';
import { Bell } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { useNavigate } from 'react-router-dom';
import kittenImage from '../../../assets/kitten.jpg';
import ufoImage from '../../../assets/ufo.png';
import emptyInbox from '../../../assets/empty-inbox.png';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

async function fetchNotifications(
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  isAuthenticated: boolean,
  setNotifications: React.Dispatch<React.SetStateAction<AppNotification[]>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) {
  try {
    setIsLoading(true);
    if (!isAuthenticated) return;
    const data = await notificationsApi.getNotification();
    setNotifications(data);
  } catch {
    setError('Failed to fetch notifications');
  } finally {
    setIsLoading(false);
  }
}

export default function NotificationDropdown() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleNotification = (notification: AppNotification) => {
    navigate(notification.pageRef);
  };

  useEffect(() => {
    fetchNotifications(setIsLoading, isAuthenticated, setNotifications, setError);
    const interval = setInterval(() => {
      fetchNotifications(setIsLoading, isAuthenticated, setNotifications, setError);
    }, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  return (
    <div className="mr-8 flex">
      <DropdownMenu
        onOpenChange={(open) => {
          if (open) fetchNotifications(setIsLoading, isAuthenticated, setNotifications, setError);
        }}
      >
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="transition-all hover:scale-110 hover:bg-gray-300">
            {notifications.length > 0 ? (
              <div className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500" />
              </div>
            ) : (
              <Bell className="h-5 w-5" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          {isLoading && (
            <>
              <div className="mt-4 flex justify-center">
                <Loader2 className="h-20 w-20 animate-spin" />
              </div>
              <div className="mt-2 mb-4 flex justify-center">
                <span className="font-light">Loading, please wait..</span>
              </div>
            </>
          )}
          {error && (
            <>
              <div className="mt-4 flex justify-center">
                <img src={emptyInbox} alt="CN" className="h-20 w-20"></img>
              </div>
              <div className="mt-2 mb-4 flex justify-center">
                <span className="font-bold">Uh oh.. Something went wrong.</span>
              </div>
            </>
          )}
          {!isLoading && !error && notifications.length == 0 && (
            <>
              <div className="mt-4 flex justify-center">
                <img src={ufoImage} alt="CN"></img>
              </div>
              <div className="mb-2 flex justify-center">
                <span className="font-bold">No Notifications</span>
              </div>
              <div className="mb-4 flex flex-row items-center justify-center">
                <span className="font-light">There are no new notificaitons here yet!</span>
              </div>
            </>
          )}
          {!isLoading && !error && notifications.length > 0 && (
            <div className="max-h-96 overflow-y-auto">
              {notifications.map((notification) => (
                <Card
                  className="h-full w-full hover:bg-gray-100"
                  key={notification._id}
                  onClick={() =>
                    notificationsApi.markAsRead(notification._id).then(() => {
                      setNotifications((prev) => prev.filter((n) => n._id !== notification._id));
                      handleNotification(notification);
                    })
                  }
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="ml-4 h-full">
                        <AvatarImage src={notification.actorRef.avatar || kittenImage} alt="Avatar" />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <div>
                        <p>
                          {notification.actorRef.firstName} {notification.actorRef.lastName}
                        </p>
                        <p>{notification.message}</p>
                      </div>
                    </div>
                    <Button
                      className="bg-gray-500 px-2 py-1 text-sm text-white transition-all hover:bg-gray-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        notificationsApi.markAsRead(notification._id).then(() => {
                          setNotifications((prev) => prev.filter((n) => n._id !== notification._id));
                        });
                      }}
                    >
                      Mark As Read
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
          {notifications.length > 0 ? (
            <div className="flex justify-center">
              <Button
                className="mt-2 mb-2 transition-all hover:scale-105 hover:bg-gray-800"
                onClick={() =>
                  notificationsApi.markAllAsRead().then(() => {
                    setNotifications([]);
                  })
                }
              >
                Mark all as read
              </Button>
            </div>
          ) : (
            ''
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
