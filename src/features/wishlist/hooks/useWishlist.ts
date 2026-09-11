'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useSessionEmail } from '@/features/auth/hooks/useSessionEmail';
import {
  pickVariantForProduct,
  productIdFromVariantId,
  toApiProductId,
  toWishlistItem,
} from '@/features/wishlist/lib/favorites';
import { useGetProductVariantsQuery } from '@/store/endpoints/catalogMetaEndpoints';
import {
  useCreateFavoriteMutation,
  useDeleteFavoriteMutation,
  useGetFavoritesQuery,
} from '@/store/endpoints/favoritesEndpoints';
import {
  addToWishlist,
  mergeRemoteWishlist,
  removeFromWishlist,
  upsertWishlistItem,
} from '@/store/slices/wishlistSlice';
import type { RootState } from '@/store/store';
import type { ProductVariant } from '@/store/types';

const EMPTY_VARIANTS: ProductVariant[] = [];

export function useWishlist() {
  const dispatch = useDispatch();
  const { hasSession } = useSessionEmail();
  const items = useSelector((state: RootState) => state.wishlist.items);
  const pendingIds = useRef(new Set<string>());

  const { data: remoteFavorites, isSuccess: isRemoteReady } = useGetFavoritesQuery(undefined, {
    skip: !hasSession,
  });
  const { data: variants = EMPTY_VARIANTS } = useGetProductVariantsQuery();
  const [createFavorite] = useCreateFavoriteMutation();
  const [deleteFavorite] = useDeleteFavoriteMutation();

  const remoteItems = useMemo(
    () =>
      (remoteFavorites ?? [])
        .map((favorite) => toWishlistItem(favorite, variants))
        .filter((item) => Boolean(item.productId) || Boolean(item.variantId)),
    [remoteFavorites, variants],
  );

  useEffect(() => {
    if (!hasSession || !isRemoteReady || !remoteFavorites) return;
    dispatch(mergeRemoteWishlist(remoteItems));
  }, [dispatch, hasSession, isRemoteReady, remoteFavorites, remoteItems]);

  const isInWishlist = useCallback(
    (productId: string) =>
      items.some((item) => {
        if (item.productId === productId) return true;
        if (!item.variantId) return false;
        return productIdFromVariantId(item.variantId, variants) === productId;
      }),
    [items, variants],
  );

  const toggleWishlist = useCallback(
    async (productId: string) => {
      if (pendingIds.current.has(productId)) return;

      const existing = items.find((item) => {
        if (item.productId === productId) return true;
        if (!item.variantId) return false;
        return productIdFromVariantId(item.variantId, variants) === productId;
      });
      const apiProductId = toApiProductId(productId);
      const variant =
        existing?.variantId != null
          ? variants.find((item) => Number(item.id) === existing.variantId)
          : apiProductId != null
            ? pickVariantForProduct(apiProductId, variants)
            : undefined;

      if (!hasSession || apiProductId == null) {
        if (existing) {
          dispatch(removeFromWishlist(productId));
          return;
        }

        dispatch(addToWishlist({ productId, variantId: variant?.id }));
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

        if (!variant) {
          dispatch(addToWishlist({ productId }));
          return;
        }

        dispatch(addToWishlist({ productId, variantId: variant.id }));
        const created = await createFavorite({ product_variant: variant.id }).unwrap();
        dispatch(
          upsertWishlistItem({
            ...toWishlistItem(created, variants),
            productId,
            variantId: created.variantId || variant.id,
          }),
        );
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
    [createFavorite, deleteFavorite, dispatch, hasSession, items, variants],
  );

  return {
    items,
    isInWishlist,
    toggleWishlist,
  };
}
