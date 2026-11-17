'use client';

import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { logTokenExpirations } from '@/features/auth/lib/jwtExpiration';
import { saveUserEmail } from '@/features/auth/lib/userInitials';
import { useSyncGuestFavorites } from '@/features/wishlist/hooks/useSyncGuestFavorites';
import { useGoogleAuthMutation, useLazyGetCurrentUserQuery } from '@/store/endpoints/authEndpoints';
import { setAuthEmail, setToken } from '@/store/slices/userSlice';

export function useGoogleAuth() {
  const dispatch = useDispatch();
  const [googleAuth, { isLoading }] = useGoogleAuthMutation();
  const [fetchCurrentUser] = useLazyGetCurrentUserQuery();
  const syncGuestFavorites = useSyncGuestFavorites();

  const signInWithGoogle = useCallback(
    async (token: string, acceptTerms: boolean) => {
      const result = await googleAuth({
        token,
        accept_terms: acceptTerms,
      }).unwrap();

      localStorage.setItem('accessToken', result.access);
      localStorage.setItem('refreshToken', result.refresh);
      logTokenExpirations(result.access, result.refresh);
      dispatch(setToken(result.access));

      const user = await fetchCurrentUser().unwrap();
      if (user.email) {
        saveUserEmail(user.email);
        dispatch(setAuthEmail(user.email));
      }

      await syncGuestFavorites();

      return result;
    },
    [dispatch, fetchCurrentUser, googleAuth, syncGuestFavorites],
  );

  return { signInWithGoogle, isLoading };
}
