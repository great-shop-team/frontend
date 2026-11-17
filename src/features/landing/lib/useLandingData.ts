'use client';

import { useMemo } from 'react';

import {
  landingCampaignImage,
  landingEyewear,
  landingFeaturedFragrance,
  landingFeaturedFrames,
  landingFeaturedLook,
  landingHeroSlides,
  landingPressItems,
  landingPromoDuoItems,
  landingShopByItems,
  landingStreetStyleItems,
  landingWearlyItems,
} from '@/data/landingAssets';
import { useTranslation } from '@/i18n/useTranslation';

export function useLandingData() {
  const { t } = useTranslation();

  return useMemo(
    () => ({
      hero: {
        cta: t.landing.hero.cta,
        slidesAriaLabel: t.landing.hero.slidesAriaLabel,
        goToSlide: t.landing.hero.goToSlide,
        slides: landingHeroSlides.map((slide) => {
          const copy = t.landing.hero.slides[slide.id];
          return {
            id: slide.id,
            video: slide.video,
            href: slide.href,
            title: copy.title,
            description: copy.description,
          };
        }),
      },
      shopBy: landingShopByItems.map((item) => ({
        id: item.id,
        href: item.href,
        image: { src: item.image.src, alt: t.landing.shopByItems[item.id].imageAlt },
        label: t.landing.shopByItems[item.id].label,
      })),
      featuredFrames: {
        lookEditorial: {
          href: landingFeaturedFrames.lookEditorial.href,
          image: {
            src: landingFeaturedFrames.lookEditorial.src,
            alt: t.landing.featuredFrames.lookEditorial.imageAlt,
          },
          title: t.landing.featuredFrames.lookEditorial.title,
        },
        lookProduct: {
          id: landingFeaturedFrames.lookProduct.id,
          href: landingFeaturedFrames.lookProduct.href,
          image: {
            src: landingFeaturedFrames.lookProduct.image.src,
            alt: t.landing.featuredFrames.lookProduct.imageAlt,
          },
          title: t.landing.featuredFrames.lookProduct.title,
          price: t.landing.featuredFrames.lookProduct.price,
        },
        scentProduct: {
          id: landingFeaturedFrames.scentProduct.id,
          href: landingFeaturedFrames.scentProduct.href,
          image: {
            src: landingFeaturedFrames.scentProduct.image.src,
            alt: t.landing.featuredFrames.scentProduct.imageAlt,
          },
          title: t.landing.featuredFrames.scentProduct.title,
          subtitle: t.landing.featuredFrames.scentProduct.subtitle,
          price: t.landing.featuredFrames.scentProduct.price,
        },
        scentEditorial: {
          href: landingFeaturedFrames.scentEditorial.href,
          image: {
            src: landingFeaturedFrames.scentEditorial.src,
            alt: t.landing.featuredFrames.scentEditorial.imageAlt,
          },
          title: t.landing.featuredFrames.scentEditorial.title,
        },
      },
      featuredLook: {
        editorial: {
          src: landingFeaturedLook.editorial.src,
          alt: t.landing.featuredLook.editorialAlt,
        },
        product: {
          id: landingFeaturedLook.product.id,
          href: landingFeaturedLook.product.href,
          image: {
            src: landingFeaturedLook.product.image.src,
            alt: t.landing.featuredLook.product.imageAlt,
          },
          title: t.landing.featuredLook.product.title,
          price: t.landing.featuredLook.product.price,
        },
      },
      featuredFragrance: {
        editorial: {
          src: landingFeaturedFragrance.editorial.src,
          alt: t.landing.featuredFragrance.editorialAlt,
        },
        product: {
          id: landingFeaturedFragrance.product.id,
          href: landingFeaturedFragrance.product.href,
          image: {
            src: landingFeaturedFragrance.product.image.src,
            alt: t.landing.featuredFragrance.product.imageAlt,
          },
          title: t.landing.featuredFragrance.product.title,
          price: t.landing.featuredFragrance.product.price,
        },
      },
      streetStyle: landingStreetStyleItems.map((item) => ({
        id: item.id,
        href: item.href,
        image: { src: item.image.src, alt: t.landing.streetStyleItems[item.id].imageAlt },
      })),
      wearly: landingWearlyItems.map((item) => ({
        id: item.id,
        href: item.href,
        image: { src: item.image.src, alt: t.landing.wearlyItems[item.id].imageAlt },
      })),
      promoDuo: landingPromoDuoItems.map((item) => ({
        id: item.id,
        href: item.href,
        image: { src: item.image.src, alt: t.landing.promoDuo[item.id].imageAlt },
        label: t.landing.promoDuo[item.id].label,
      })),
      campaign: {
        href: landingCampaignImage.href,
        image: { src: landingCampaignImage.src, alt: t.landing.campaign.imageAlt },
        title: t.landing.campaign.title,
        subtitle: t.landing.campaign.subtitle,
        cta: t.landing.campaign.cta,
      },
      eyewear: {
        title: t.landing.eyewear.title,
        editorial: {
          href: landingEyewear.editorial.href,
          src: landingEyewear.editorial.src,
          alt: t.landing.eyewear.editorialAlt,
        },
        product: {
          id: landingEyewear.product.id,
          href: landingEyewear.product.href,
          image: {
            src: landingEyewear.product.image.src,
            alt: t.landing.eyewear.product.imageAlt,
          },
          title: t.landing.eyewear.product.title,
          price: t.landing.eyewear.product.price,
        },
      },
      press: landingPressItems.map((item) => ({
        id: item.id,
        href: item.href,
        image: { src: item.image.src, alt: t.landing.pressItems[item.id].imageAlt },
      })),
      labels: {
        recentlyReleased: t.landing.recentlyReleased,
        shopAll: t.landing.shopAll,
        bestSellers: t.landing.bestSellers,
        shopBy: t.landing.shopBy,
        shopByCategory: t.landing.shopByCategory,
        streetStyle: t.landing.streetStyle,
        pressMedia: t.landing.pressMedia,
        pressHandle: t.landing.pressHandle,
        wearly: t.landing.wearly,
        viewAll: t.landing.viewAll,
        shopNow: t.landing.shopNow,
        addToCart: t.landing.addToCart,
        prev: t.landing.prev,
        next: t.landing.next,
      },
    }),
    [t],
  );
}
