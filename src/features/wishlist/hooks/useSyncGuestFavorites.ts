'use client';

import { useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  pickVariantForProduct,
  toApiProductId,
} from '@/features/wishlist/lib/favorites';
import { useLazyGetProductVariantsQuery } from '@/store/endpoints/catalogMetaEndpoints';
import {
  useCreateFavoriteMutation,
  useLazyGetFavoritesQuery,
} from '@/store/endpoints/favoritesEndpoints';
import { api } from '@/store/api';
import { upsertWishlistItem } from '@/store/slices/wishlistSlice';
import type { RootState } from '@/store/store';
import type { ProductVariant, WishlistItem } from '@/store/types';

function resolveVariantId(item: WishlistItem, variants: ProductVariant[]) {
  if (item.variantId != null) return item.variantId;

  const productId = toApiProductId(item.productId);
  if (productId == null) return undefined;

  return pickVariantForProduct(productId, variants)?.id;
}

let syncPromise: Promise<void> | null = null;

export function useSyncGuestFavorites() {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.wishlist.items);
  const itemsRef = useRef(items);
  itemsRef.current = items;

  const [fetchFavorites] = useLazyGetFavoritesQuery();
  const [fetchVariants] = useLazyGetProductVariantsQuery();
  const [createFavorite] = useCreateFavoriteMutation();

  return useCallback(async () => {
    if (syncPromise) return syncPromise;

    syncPromise = (async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
        if (!token) return;

        const [serverFavorites, variants] = await Promise.all([
          fetchFavorites().unwrap(),
          fetchVariants().unwrap(),
        ]);

        const serverVariantIds = new Set(serverFavorites.map((item) => item.variantId));
        let createdAny = false;

        for (const item of itemsRef.current) {
          if (item.favoriteId && item.favoriteId > 0) continue;

          const variantId = resolveVariantId(item, variants);
          if (variantId == null || serverVariantIds.has(variantId)) continue;

          try {
            const created = await createFavorite({ product_variant: variantId }).unwrap();
            const syncedVariantId = created.variantId || variantId;
            serverVariantIds.add(syncedVariantId);
            createdAny = true;
            dispatch(
              upsertWishlistItem({
                productId: item.productId,
                variantId: syncedVariantId,
                favoriteId: created.id > 0 ? created.id : undefined,
              }),
            );
          } catch {
            // Local item stays; it will retry on the next sync.
          }
        }

        if (createdAny) {
          dispatch(api.util.invalidateTags([{ type: 'Favorite', id: 'LIST' }]));
        }
      } catch {
        // Login should still succeed if favorites sync fails.
      }
    })().finally(() => {
      syncPromise = null;
    });

    return syncPromise;
  }, [createFavorite, dispatch, fetchFavorites, fetchVariants]);
}
