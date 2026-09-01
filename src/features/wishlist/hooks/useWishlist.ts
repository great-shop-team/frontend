'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useSessionEmail } from '@/features/auth/hooks/useSessionEmail';
import { toApiProductId, toWishlistItem } from '@/features/wishlist/lib/favorites';
import {
  useCreateFavoriteMutation,
  useDeleteFavoriteMutation,
  useGetFavoritesQuery,
} from '@/store/endpoints/favoritesEndpoints';
import {
  addToWishlist,
  removeFromWishlist,
  setWishlist,
  upsertWishlistItem,
} from '@/store/slices/wishlistSlice';
import type { RootState } from '@/store/store';

export function useWishlist() {
  const dispatch = useDispatch();
  const { hasSession } = useSessionEmail();
  const localItems = useSelector((state: RootState) => state.wishlist.items);
  const pendingIds = useRef(new Set<string>());

  const { data: remoteFavorites } = useGetFavoritesQuery(undefined, {
    skip: !hasSession,
  });
  const [createFavorite] = useCreateFavoriteMutation();
  const [deleteFavorite] = useDeleteFavoriteMutation();

  const remoteItems = useMemo(
    () => (remoteFavorites ?? []).map(toWishlistItem),
    [remoteFavorites],
  );

  const items = hasSession ? (remoteFavorites ? remoteItems : localItems) : localItems;

  useEffect(() => {
    if (!hasSession || !remoteFavorites) return;
    dispatch(setWishlist(remoteItems));
  }, [dispatch, hasSession, remoteFavorites, remoteItems]);

  const isInWishlist = useCallback(
    (productId: string) => items.some((item) => item.productId === productId),
    [items],
  );

  const toggleWishlist = useCallback(
    async (productId: string) => {
      if (pendingIds.current.has(productId)) return;

      const existing = items.find((item) => item.productId === productId);
      const apiProductId = toApiProductId(productId);

      if (!hasSession || apiProductId == null) {
        if (existing) {
          dispatch(removeFromWishlist(productId));
          return;
        }

        dispatch(addToWishlist({ productId }));
        return;
      }

      pendingIds.current.add(productId);

      try {
        if (existing) {
          dispatch(removeFromWishlist(productId));
          if (existing.favoriteId && existing.favoriteId > 0) {
            await deleteFavorite(existing.favoriteId).unwrap();
          }
          return;
        }

        dispatch(addToWishlist({ productId }));
        const created = await createFavorite({ product: apiProductId }).unwrap();
        dispatch(upsertWishlistItem(toWishlistItem(created)));
      } catch {
        if (existing) {
          dispatch(upsertWishlistItem(existing));
        } else {
          dispatch(removeFromWishlist(productId));
        }
      } finally {
        pendingIds.current.delete(productId);
      }
    },
    [createFavorite, deleteFavorite, dispatch, hasSession, items],
  );

  return {
    items,
    isInWishlist,
    toggleWishlist,
  };
}
