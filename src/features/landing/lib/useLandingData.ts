'use client';

import { useMemo } from 'react';

import {
  landingCategoryItems,
  landingClothingItems,
  landingFragranceItems,
  landingLifestyleImage,
} from '@/data/landingAssets';
import { useTranslation } from '@/i18n/useTranslation';

export function useLandingData() {
  const { t } = useTranslation();

  return useMemo(
    () => ({
      hero: {
        image: { src: '/images/heroBanner.jpg', alt: t.landing.hero.imageAlt },
        title: t.landing.hero.title,
        description: t.landing.hero.description,
        cta: { href: '/catalog', label: t.landing.hero.cta },
      },
      clothing: landingClothingItems.map((item) => {
        const copy = t.landing.clothing[item.id];
        return {
          id: item.id,
          image: { src: item.image.src, alt: copy.imageAlt },
          title: copy.title,
          price: copy.price,
        };
      }),
      categories: landingCategoryItems.map((item) => {
        const copy = t.landing.categories[item.id];
        return {
          title: copy.title,
          href: item.href,
          image: { src: item.image.src, alt: copy.imageAlt },
          thumb: { src: item.thumb.src, alt: '' },
        };
      }),
      promo: {
        image: { src: '/images/Landing/SweetObsession.png', alt: t.landing.promo.imageAlt },
        title: t.landing.promo.title,
        description: t.landing.promo.description,
        cta: { href: '/catalog/accessories', label: t.landing.promo.cta },
      },
      fragrances: landingFragranceItems.map((item) => {
        const copy = t.landing.fragrances[item.id];
        return {
          id: item.id,
          image: { src: item.image.src, alt: copy.imageAlt },
          title: copy.title,
          price: copy.price,
          sizes: [...item.sizes],
        };
      }),
      lifestyle: {
        image: { src: landingLifestyleImage.src, alt: t.landing.lifestyle.imageAlt },
        title: t.landing.lifestyle.title,
        description: t.landing.lifestyle.description,
        cta: { href: '/catalog', label: t.landing.lifestyle.cta },
      },
      labels: {
        recentlyReleased: t.landing.recentlyReleased,
        viewAllProducts: t.landing.viewAllProducts,
        viewAll: t.landing.viewAll,
        shopNow: t.landing.shopNow,
      },
    }),
    [t],
  );
}
