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

// Load from localStorage
const loadFromLocalStorage = (): Notification[] => {
  try {
    const item = localStorage.getItem('notifications');
    return item ? JSON.parse(item) : [];
  } catch {
    return [];
  }
};

const initialState: NotificationsState = {
  notifications: loadFromLocalStorage(),
  unreadCount: loadFromLocalStorage().filter(n => !n.read).length,
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
      localStorage.setItem('notifications', JSON.stringify(state.notifications));
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount--;
        localStorage.setItem('notifications', JSON.stringify(state.notifications));
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(n => n.read = true);
      state.unreadCount = 0;
      localStorage.setItem('notifications', JSON.stringify(state.notifications));
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.read) {
        state.unreadCount--;
      }
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
      localStorage.setItem('notifications', JSON.stringify(state.notifications));
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
      localStorage.removeItem('notifications');
    },
  },
});

export const {
  addNotification,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearAllNotifications,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;

