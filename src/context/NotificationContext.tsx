import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import type { Notification, NotificationType } from '@/types';

interface NotificationContextValue {
  notifications: Notification[];
  notify: (type: NotificationType, text: string, duration?: number) => void;
  dismiss: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

let notificationCounter = 0;

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const notify = useCallback(
    (type: NotificationType, text: string, duration = 3000) => {
      const id = `notification-${++notificationCounter}`;
      const notification: Notification = { id, type, text, duration };

      setNotifications((prev) => [...prev, notification]);

      if (type !== 'error' && duration > 0) {
        setTimeout(() => dismiss(id), duration);
      }
    },
    [dismiss],
  );

  return (
    <NotificationContext.Provider value={{ notifications, notify, dismiss }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotification must be used within NotificationProvider');
  return ctx;
}
