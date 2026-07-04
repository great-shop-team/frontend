'use client';

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useWishlistAuth } from '@/features/wishlist/context/WishlistAuthProvider';
import { addToWishlist, removeFromWishlist } from '@/store/slices/wishlistSlice';
import type { RootState } from '@/store/store';

export function useWishlist() {
  const dispatch = useDispatch();
  const { requireAuth } = useWishlistAuth();
  const items = useSelector((state: RootState) => state.wishlist.items);

  const isInWishlist = useCallback(
    (productId: string) => items.some((item) => item.productId === productId),
    [items],
  );

  const toggleWishlist = useCallback(
    (productId: string) => {
      requireAuth(() => {
        if (isInWishlist(productId)) {
          dispatch(removeFromWishlist(productId));
          return;
        }

        dispatch(addToWishlist({ productId }));
      });
    },
    [dispatch, isInWishlist, requireAuth],
  );

  return {
    items,
    isInWishlist,
    toggleWishlist,
  };
}
