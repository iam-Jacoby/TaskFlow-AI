import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Bell, CheckCircle2, Clock, Users, AlertTriangle } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'task' | 'team' | 'system' | 'reminder';
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Task Due Soon',
    message: 'Design user authentication flow is due tomorrow',
    type: 'reminder',
    time: '2 hours ago',
    read: false
  },
  {
    id: '2',
    title: 'Team Update',
    message: 'Sarah Chen completed the wireframe review',
    type: 'team',
    time: '4 hours ago',
    read: false
  },
  {
    id: '3',
    title: 'Task Completed',
    message: 'CI/CD pipeline setup has been completed',
    type: 'task',
    time: '1 day ago',
    read: true
  },
  {
    id: '4',
    title: 'System Alert',
    message: 'Your API usage is approaching the monthly limit',
    type: 'system',
    time: '2 days ago',
    read: true
  }
];

const typeIcons = {
  task: CheckCircle2,
  team: Users,
  system: AlertTriangle,
  reminder: Clock
};

const typeColors = {
  task: 'text-green-600',
  team: 'text-blue-600',
  system: 'text-orange-600',
  reminder: 'text-purple-600'
};

export function NotificationsPanel() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs bg-red-500 hover:bg-red-500 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 mr-4" align="end" sideOffset={5}>
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <Button variant="link" size="sm" onClick={markAllAsRead}>
                Mark all read
              </Button>
            )}
          </div>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No notifications
            </div>
          ) : (
            notifications.map((notification) => {
              const Icon = typeIcons[notification.type];
              
              return (
                <div
                  key={notification.id}
                  className={`p-4 border-b hover:bg-muted/50 cursor-pointer transition-colors ${
                    !notification.read ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <Icon className={`w-4 h-4 mt-1 ${typeColors[notification.type]}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm">{notification.title}</p>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        
        {notifications.length > 0 && (
          <div className="p-3 border-t">
            <Button variant="link" size="sm" className="w-full">
              View all notifications
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
