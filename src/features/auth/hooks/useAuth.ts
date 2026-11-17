'use client';

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { clearStoredUserEmail } from '@/features/auth/lib/userInitials';
import { api } from '@/store/api';
import {
  logout,
  selectAuthEmail,
  selectAuthToken,
  selectCurrentUser,
  selectIsAuthenticated,
} from '@/store/slices/userSlice';

export function useAuth() {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectAuthToken);
  const authEmail = useSelector(selectAuthEmail);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const logoutUser = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    clearStoredUserEmail();
    dispatch(logout());
    dispatch(api.util.resetApiState());
  }, [dispatch]);

  return {
    user,
    token,
    authEmail,
    isAuthenticated,
    logoutUser,
  };
}
