import { useNavigate } from 'react-router-dom';
import { Bell, X, CheckCircle, Film, Clock, Info } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Dialog, DialogContent } from './ui/dialog';
import { Button } from './ui/button';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { markAsRead, markAllAsRead, removeNotification } from '../../store/slices/notificationsSlice';
import type { Notification } from '../../store/slices/notificationsSlice';

interface NotificationsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'booking':
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case 'new_movie':
      return <Film className="w-5 h-5 text-blue-500" />;
    case 'reminder':
      return <Clock className="w-5 h-5 text-yellow-500" />;
    default:
      return <Info className="w-5 h-5 text-gray-500" />;
  }
};

export function NotificationsModal({ open, onOpenChange }: NotificationsModalProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { notifications, unreadCount } = useAppSelector((state) => state.notifications);

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      dispatch(markAsRead(notification.id));
    }
    if (notification.link) {
      navigate(notification.link);
      onOpenChange(false);
    }
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  const handleRemove = (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation();
    dispatch(removeNotification(notificationId));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-hidden flex flex-col bg-gray-900 border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-white" />
            <h2 className="text-xl font-semibold text-white">Notifications</h2>
            {unreadCount > 0 && (
              <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              onClick={handleMarkAllAsRead}
              variant="ghost"
              className="text-xs text-gray-400 hover:text-white"
            >
              Tout marquer comme lu
            </Button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Aucune notification</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`w-full flex items-start gap-3 p-3 rounded-lg transition-colors text-left ${
                    notification.read
                      ? 'bg-gray-800 hover:bg-gray-700'
                      : 'bg-gray-800/50 hover:bg-gray-800 border-l-2 border-red-600'
                  }`}
                >
                  <div className="mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={`font-semibold ${notification.read ? 'text-gray-300' : 'text-white'}`}>
                        {notification.title}
                      </h3>
                      <button
                        onClick={(e) => handleRemove(e, notification.id)}
                        className="text-gray-500 hover:text-white transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-gray-400 text-sm mt-1">{notification.message}</p>
                    <p className="text-gray-500 text-xs mt-2">
                      {format(new Date(notification.createdAt), 'PPp', { locale: fr })}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

