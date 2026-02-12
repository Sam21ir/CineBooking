import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface UsersState {
  currentUser: User | null;
  isAuthenticated: boolean;
}

const initialState: UsersState = {
  currentUser: null,
  isAuthenticated: false,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, logout } = usersSlice.actions;
export default usersSlice.reducer;

