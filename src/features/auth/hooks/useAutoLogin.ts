'use client';

import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { clearPendingAuth } from '@/features/auth/lib/pendingAuth';
import { normalizeEmail } from '@/features/auth/lib/normalizeEmail';
import { saveUserEmail } from '@/features/auth/lib/userInitials';
import { logTokenExpirations } from '@/features/auth/lib/jwtExpiration';
import { useSyncGuestFavorites } from '@/features/wishlist/hooks/useSyncGuestFavorites';
import { useLazyGetCurrentUserQuery, useLoginMutation } from '@/store/endpoints/authEndpoints';
import { setAuthEmail, setToken } from '@/store/slices/userSlice';

const LOGIN_RETRY_DELAY_MS = 800;
const LOGIN_MAX_ATTEMPTS = 4;

function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function useAutoLogin() {
  const dispatch = useDispatch();
  const [login] = useLoginMutation();
  const [fetchCurrentUser] = useLazyGetCurrentUserQuery();
  const syncGuestFavorites = useSyncGuestFavorites();

  const autoLogin = useCallback(
    async (email: string, password: string) => {
      let lastError: unknown;

      for (let attempt = 0; attempt < LOGIN_MAX_ATTEMPTS; attempt += 1) {
        if (attempt > 0) {
          await wait(LOGIN_RETRY_DELAY_MS);
        }

        try {
          const normalizedEmail = normalizeEmail(email);
          const result = await login({
            email_or_phone: normalizedEmail,
            password,
          }).unwrap();
          saveUserEmail(normalizedEmail);
          localStorage.setItem('accessToken', result.access);
          localStorage.setItem('refreshToken', result.refresh);
          logTokenExpirations(result.access, result.refresh);
          dispatch(setToken(result.access));
          dispatch(setAuthEmail(normalizedEmail));
          await fetchCurrentUser();
          await syncGuestFavorites();
          clearPendingAuth();
          return;
        } catch (error) {
          lastError = error;
        }
      }

      throw lastError;
    },
    [dispatch, login, fetchCurrentUser, syncGuestFavorites],
  );

  return autoLogin;
}
