import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@/store/types';
import { authEndpoints } from '../endpoints/authEndpoints';

interface AuthState {
  user: User | null;
  token: string | null;
  authEmail: string | null;
  status: 'idle' | 'loading' | 'authenticated' | 'signed_out';
}

const initialState: AuthState = {
  user: null,
  token: null,
  authEmail: null,
  status: 'idle',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.status = 'authenticated';
    },
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
      if (action.payload) state.status = 'authenticated';
    },
    setAuthEmail(state, action: PayloadAction<string>) {
      state.authEmail = action.payload;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.authEmail = null;
      state.status = 'signed_out';
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authEndpoints.endpoints.login.matchFulfilled, (state, action) => {
        state.token = action.payload.access;
        state.status = 'authenticated';
      })
      .addMatcher(
        authEndpoints.endpoints.getCurrentUser.matchFulfilled,
        (state, action: PayloadAction<User>) => {
          state.user = action.payload;
          const profile = action.payload as User & { user?: { email?: string } };
          const email = profile.email || profile.user?.email;
          if (email) state.authEmail = email;
          state.status = 'authenticated';
        },
      );
  },
});

export const selectCurrentUser = (state: { user: AuthState }) => state.user.user;
export const selectAuthToken = (state: { user: AuthState }) => state.user.token;
export const selectAuthEmail = (state: { user: AuthState }) => state.user.authEmail;
export const selectIsAuthenticated = (state: { user: AuthState }) =>
  state.user.status === 'authenticated' || !!state.user.token;

export const { setUser, setToken, setAuthEmail, logout } = userSlice.actions;
export default userSlice.reducer;
