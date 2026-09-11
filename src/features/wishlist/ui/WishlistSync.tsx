'use client';

import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { useSessionEmail } from '@/features/auth/hooks/useSessionEmail';
import { pickVariantForProduct, toApiProductId } from '@/features/wishlist/lib/favorites';
import { useGetProductVariantsQuery } from '@/store/endpoints/catalogMetaEndpoints';
import {
  useCreateFavoriteMutation,
  useGetFavoritesQuery,
} from '@/store/endpoints/favoritesEndpoints';
import { selectAuthToken } from '@/store/slices/userSlice';
import { persistor, type RootState } from '@/store/store';
import type { ProductVariant } from '@/store/types';

const EMPTY_VARIANTS: ProductVariant[] = [];

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
  const { data: variants = EMPTY_VARIANTS, isSuccess: areVariantsReady } = useGetProductVariantsQuery(
    undefined,
    { skip: !hasSession },
  );
  const [createFavorite] = useCreateFavoriteMutation();

  useEffect(() => {
    if (!hasSession) {
      mergedForToken.current = null;
      return;
    }

    const sessionKey = token || 'session';
    if (
      !rehydrated ||
      !isSuccess ||
      !areVariantsReady ||
      !data ||
      mergedForToken.current === sessionKey
    ) {
      return;
    }

    mergedForToken.current = sessionKey;

    const serverVariantIds = new Set(data.map((item) => item.variantId));

    localItems.forEach((item) => {
      const productId = toApiProductId(item.productId);
      const variantId =
        item.variantId ?? (productId != null ? pickVariantForProduct(productId, variants)?.id : undefined);

      if (variantId == null || serverVariantIds.has(variantId) || item.favoriteId) return;

      void createFavorite({ product_variant: variantId });
    });
  }, [
    areVariantsReady,
    createFavorite,
    data,
    hasSession,
    isSuccess,
    localItems,
    rehydrated,
    token,
    variants,
  ]);

  return null;
}
