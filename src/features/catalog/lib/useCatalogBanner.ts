'use client';

import { useMemo } from 'react';

import { getCatalogBannerImageSrc } from '@/features/catalog/lib/catalogBanner';
import type { CatalogScope } from '@/features/catalog/model/catalogCategory';
import { useTranslation } from '@/i18n/useTranslation';

export function useCatalogBanner(category: CatalogScope) {
  const { t } = useTranslation();

  return useMemo(() => {
    if (category === 'all') {
      return {
        image: {
          src: getCatalogBannerImageSrc(category),
          alt: t.catalog.bannerImageAlt,
        },
        title: t.catalog.allBannerTitle,
        description: t.catalog.allBannerDescription,
        shopNowLabel: t.landing.shopNow,
      };
    }

    return {
      image: {
        src: getCatalogBannerImageSrc(category),
        alt: t.catalog.categories[category].bannerImageAlt,
      },
      title: t.catalog.categories[category].bannerTitle,
      description: t.catalog.categories[category].bannerDescription,
      shopNowLabel: t.landing.shopNow,
    };
  }, [category, t]);
}
