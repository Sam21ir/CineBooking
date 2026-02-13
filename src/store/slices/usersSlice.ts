import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { userApi } from '../../services/api';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface UsersState {
  currentUser: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  currentUser: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Async thunks
export const login = createAsyncThunk(
  'users/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const user = await userApi.login(email, password);
      if (!user) {
        return rejectWithValue('Invalid email or password');
      }
      // Store user in localStorage for persistence
      localStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const register = createAsyncThunk(
  'users/register',
  async ({ name, email, password }: { name: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const user = await userApi.register(name, email, password);
      // Store user in localStorage for persistence
      localStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'users/updateProfile',
  async ({ id, updates }: { id: string; updates: Partial<User> }, { rejectWithValue }) => {
    try {
      const updatedUser = await userApi.updateUser(id, updates);
      // Update localStorage
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update profile');
    }
  }
);

export const loadUserFromStorage = createAsyncThunk(
  'users/loadUserFromStorage',
  async () => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      return JSON.parse(storedUser) as User;
    }
    return null;
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('currentUser', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      localStorage.removeItem('currentUser');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Load from storage
      .addCase(loadUserFromStorage.fulfilled, (state, action) => {
        if (action.payload) {
          state.currentUser = action.payload;
          state.isAuthenticated = true;
        }
      });
  },
});

export const { setUser, logout, clearError } = usersSlice.actions;
export default usersSlice.reducer;

