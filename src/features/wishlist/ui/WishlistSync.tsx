'use client';

import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { useSessionEmail } from '@/features/auth/hooks/useSessionEmail';
import { toApiProductId } from '@/features/wishlist/lib/favorites';
import {
  useCreateFavoriteMutation,
  useGetFavoritesQuery,
} from '@/store/endpoints/favoritesEndpoints';
import { selectAuthToken } from '@/store/slices/userSlice';
import { persistor, type RootState } from '@/store/store';

function usePersistorReady() {
  const [ready, setReady] = useState(() => persistor.getState().bootstrapped);

  useEffect(() => {
    if (ready) return undefined;

    return persistor.subscribe(() => {
      if (persistor.getState().bootstrapped) {
        setReady(true);
      }
    });
  }, [ready]);

  return ready;
}

export default function WishlistSync() {
  const { hasSession } = useSessionEmail();
  const token = useSelector(selectAuthToken);
  const localItems = useSelector((state: RootState) => state.wishlist.items);
  const rehydrated = usePersistorReady();
  const mergedForToken = useRef<string | null>(null);

  const { data, isSuccess } = useGetFavoritesQuery(undefined, {
    skip: !hasSession,
  });
  const [createFavorite] = useCreateFavoriteMutation();

  useEffect(() => {
    if (!hasSession) {
      mergedForToken.current = null;
      return;
    }

    const sessionKey = token || 'session';
    if (!rehydrated || !isSuccess || !data || mergedForToken.current === sessionKey) return;

    mergedForToken.current = sessionKey;

    const serverIds = new Set(data.map((item) => item.productId));
    const toUpload = localItems
      .map((item) => toApiProductId(item.productId))
      .filter((id): id is number => id != null && !serverIds.has(String(id)));

    toUpload.forEach((product) => {
      void createFavorite({ product });
    });
  }, [createFavorite, data, hasSession, isSuccess, localItems, rehydrated, token]);

  return null;
}
