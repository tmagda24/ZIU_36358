import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export type NotificationType = 'added' | 'completed' | 'deleted' | 'info';

export interface AppNotification {
  id: string;
  type: NotificationType;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface NotificationPreferences {
  added: boolean;
  completed: boolean;
  deleted: boolean;
}

interface NotificationsContextType {
  notifications: AppNotification[];
  preferences: NotificationPreferences;
  unreadCount: number;
  notify: (type: NotificationType, message: string) => void;
  setPreferences: (prefs: NotificationPreferences) => void;
  markAllRead: () => void;
  clearAll: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

const DEFAULT_PREFS: NotificationPreferences = { added: true, completed: true, deleted: true };
const MAX_NOTIFICATIONS = 30;

/**
 * Globalny stan powiadomień. Zdarzenia (dodanie/ukończenie/usunięcie zadania)
 * są zapisywane zgodnie z preferencjami użytkownika i utrwalane w localStorage.
 */
export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [preferences, setPreferencesState] = useLocalStorage<NotificationPreferences>(
    'taskflow-notif-prefs',
    DEFAULT_PREFS
  );

  const notify = useCallback(
    (type: NotificationType, message: string) => {
      // Respektujemy preferencje użytkownika dla zdarzeń zadań.
      if (type !== 'info' && !preferences[type]) return;
      setNotifications((prev) =>
        [
          { id: crypto.randomUUID(), type, message, createdAt: new Date().toISOString(), read: false },
          ...prev,
        ].slice(0, MAX_NOTIFICATIONS)
      );
    },
    [preferences]
  );

  const setPreferences = useCallback(
    (prefs: NotificationPreferences) => setPreferencesState(prefs),
    [setPreferencesState]
  );

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => setNotifications([]), []);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const value = useMemo(
    () => ({ notifications, preferences, unreadCount, notify, setPreferences, markAllRead, clearAll }),
    [notifications, preferences, unreadCount, notify, setPreferences, markAllRead, clearAll]
  );

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications musi być użyty wewnątrz NotificationsProvider');
  return ctx;
}
