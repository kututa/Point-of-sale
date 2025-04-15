import React, { useState } from 'react';
import { format } from 'date-fns';
import { Bell, X, Check, Settings, Trash2 } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
import { NotificationType, NotificationPriority } from '../../types/notification';
import { useNavigate } from 'react-router-dom';

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<NotificationType | 'ALL'>('ALL');
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearAll,
  } = useNotifications();
  const navigate = useNavigate();

  const filteredNotifications = selectedType === 'ALL'
    ? notifications
    : notifications.filter(n => n.type === selectedType);

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id);
    if (notification.link) {
      navigate(notification.link);
    }
    setIsOpen(false);
  };

  const getPriorityColor = (priority: NotificationPriority) => {
    switch (priority) {
      case NotificationPriority.HIGH:
        return 'text-error';
      case NotificationPriority.MEDIUM:
        return 'text-secondary';
      default:
        return 'text-primary';
    }
  };

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.INVENTORY:
        return '📦';
      case NotificationType.SALES:
        return '💰';
      case NotificationType.SYSTEM:
        return '⚙️';
      case NotificationType.USER:
        return '👤';
      default:
        return '🔔';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-primary dark:text-accent-dark hover:bg-primary/10 rounded-full"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-error rounded-full text-white text-xs flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white dark:bg-background-dark rounded-lg shadow-medium border border-border dark:border-primary/20 z-50">
            <div className="p-4 border-b border-border dark:border-primary/20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-primary dark:text-accent-dark">
                  Notifications
                </h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigate('/settings/notifications')}
                    className="p-2 hover:bg-primary/10 rounded-full"
                  >
                    <Settings className="h-5 w-5 text-primary" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-primary/10 rounded-full"
                  >
                    <X className="h-5 w-5 text-primary" />
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                {['ALL', ...Object.values(NotificationType)].map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type as any)}
                    className={`px-3 py-1 rounded-full whitespace-nowrap ${
                      selectedType === type
                        ? 'bg-primary text-white'
                        : 'bg-primary/10 text-primary hover:bg-primary/20'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {filteredNotifications.length > 0 ? (
                <div className="divide-y divide-border dark:divide-primary/20">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`p-4 hover:bg-primary/5 cursor-pointer transition-colors ${
                        !notification.read ? 'bg-primary/5' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl">{getTypeIcon(notification.type)}</span>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <h3 className={`font-medium ${getPriorityColor(notification.priority)}`}>
                              {notification.title}
                            </h3>
                            <span className="text-sm text-text-dark/60 dark:text-text-light/60">
                              {format(notification.timestamp, 'PP')}
                            </span>
                          </div>
                          <p className="text-sm text-text-dark dark:text-text-light mt-1">
                            {notification.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-text-dark/60 dark:text-text-light/60">
                  No notifications
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-4 border-t border-border dark:border-primary/20 flex justify-between">
                <button
                  onClick={markAllAsRead}
                  className="flex items-center space-x-2 text-primary hover:text-primary/80"
                >
                  <Check className="h-4 w-4" />
                  <span>Mark all as read</span>
                </button>
                <button
                  onClick={clearAll}
                  className="flex items-center space-x-2 text-error hover:text-error/80"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Clear all</span>
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}