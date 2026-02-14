import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Notification {
  id: string;
  type: 'booking' | 'new_movie' | 'reminder' | 'info';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
}

// Load from localStorage for specific user
const loadFromLocalStorage = (userId?: string): Notification[] => {
  try {
    const key = userId ? `notifications_${userId}` : 'notifications';
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : [];
  } catch {
    return [];
  }
};

// Get current user ID from localStorage
const getCurrentUserId = (): string | null => {
  try {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user).id : null;
  } catch {
    return null;
  }
};

const userId = getCurrentUserId();
const initialState: NotificationsState = {
  notifications: loadFromLocalStorage(userId || undefined),
  unreadCount: loadFromLocalStorage(userId || undefined).filter(n => !n.read).length,
};

// Helper to get storage key for current user
const getStorageKey = (): string => {
  const userId = getCurrentUserId();
  return userId ? `notifications_${userId}` : 'notifications';
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'read' | 'createdAt'>>) => {
      const notification: Notification = {
        ...action.payload,
        id: `notif-${Date.now()}-${Math.random()}`,
        read: false,
        createdAt: new Date().toISOString(),
      };
      state.notifications.unshift(notification);
      state.unreadCount++;
      const storageKey = getStorageKey();
      localStorage.setItem(storageKey, JSON.stringify(state.notifications));
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount--;
        const storageKey = getStorageKey();
        localStorage.setItem(storageKey, JSON.stringify(state.notifications));
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(n => n.read = true);
      state.unreadCount = 0;
      const storageKey = getStorageKey();
      localStorage.setItem(storageKey, JSON.stringify(state.notifications));
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.read) {
        state.unreadCount--;
      }
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
      const storageKey = getStorageKey();
      localStorage.setItem(storageKey, JSON.stringify(state.notifications));
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
      const storageKey = getStorageKey();
      localStorage.removeItem(storageKey);
    },
    loadUserNotifications: (state) => {
      const userId = getCurrentUserId();
      const notifications = loadFromLocalStorage(userId || undefined);
      state.notifications = notifications;
      state.unreadCount = notifications.filter(n => !n.read).length;
    },
  },
});

export const {
  addNotification,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearAllNotifications,
  loadUserNotifications,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;

