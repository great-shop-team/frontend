'use client';

import { useEffect, useRef } from 'react';

import { useSessionEmail } from '@/features/auth/hooks/useSessionEmail';
import { useSyncGuestFavorites } from '@/features/wishlist/hooks/useSyncGuestFavorites';

export default function WishlistSync() {
  const { hasSession } = useSessionEmail();
  const syncGuestFavorites = useSyncGuestFavorites();
  const syncedForSession = useRef(false);

  useEffect(() => {
    if (!hasSession) {
      syncedForSession.current = false;
      return;
    }

    if (syncedForSession.current) return;

    syncedForSession.current = true;
    void syncGuestFavorites();
  }, [hasSession, syncGuestFavorites]);

  return null;
}
