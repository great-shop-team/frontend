'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { getStoredUserEmail } from '@/features/auth/lib/userInitials';
import { logTokenExpirations } from '@/features/auth/lib/jwtExpiration';
import { useGetCurrentUserQuery } from '@/store/endpoints/authEndpoints';
import { setAuthEmail, setToken } from '@/store/slices/userSlice';

export default function AuthBootstrap() {
  const dispatch = useDispatch();
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  useEffect(() => {
    if (token) {
      dispatch(setToken(token));
      logTokenExpirations(token);
    }

    const storedEmail = getStoredUserEmail();
    if (storedEmail) {
      dispatch(setAuthEmail(storedEmail));
    }
  }, [dispatch, token]);

  useGetCurrentUserQuery(undefined, { skip: !token });

  return null;
}
