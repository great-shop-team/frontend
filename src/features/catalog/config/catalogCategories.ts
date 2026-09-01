import type { CatalogListingSlug } from '@/features/catalog/model/catalogCategory';

type CatalogCategoryConfig = {
  href: `/catalog/${CatalogListingSlug}`;
  bannerImageSrc: string;
};

export const catalogCategoriesConfig: Record<CatalogListingSlug, CatalogCategoryConfig> = {
  men: {
    href: '/catalog/men',
    bannerImageSrc: '/images/catalog/men.png',
  },
  women: {
    href: '/catalog/women',
    bannerImageSrc: '/images/catalog/women.png',
  },
  accessories: {
    href: '/catalog/accessories',
    bannerImageSrc: '/images/catalog/accessories.png',
  },
  fragrances: {
    href: '/catalog/fragrances',
    bannerImageSrc: '/images/catalog/perfume.png',
  },
};
