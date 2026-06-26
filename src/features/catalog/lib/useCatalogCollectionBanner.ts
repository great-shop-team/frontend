'use client';

import { useMemo } from 'react';

import { getCatalogBannerImageSrc } from '@/features/catalog/lib/catalogBanner';
import type { CatalogCollectionSlug } from '@/features/catalog/model/catalogCollection';
import { collectionSlugToI18nKey } from '@/features/catalog/model/catalogCollection';
import { useTranslation } from '@/i18n/useTranslation';

export function useCatalogCollectionBanner(collection: CatalogCollectionSlug) {
  const { t } = useTranslation();
  const copyKey = collectionSlugToI18nKey(collection);

  return useMemo(
    () => ({
      image: {
        src: getCatalogBannerImageSrc('women'),
        alt: t.catalog.collections[copyKey].bannerImageAlt,
      },
      title: t.catalog.collections[copyKey].bannerTitle,
      description: t.catalog.collections[copyKey].bannerDescription,
      shopNowLabel: t.landing.shopNow,
    }),
    [copyKey, t],
  );
}
