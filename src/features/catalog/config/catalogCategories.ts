import type { CatalogListingSlug } from '@/features/catalog/model/catalogCategory';

type CatalogCategoryConfig = {
  href: `/catalog/${CatalogListingSlug}`;
  bannerImageSrc: string;
};

export const catalogCategoriesConfig: Record<CatalogListingSlug, CatalogCategoryConfig> = {
  men: {
    href: '/catalog/men',
    bannerImageSrc: '/images/catalog/men.jpg',
  },
  women: {
    href: '/catalog/women',
    bannerImageSrc: '/images/catalog/women.jpg',
  },
  accessories: {
    href: '/catalog/accessories',
    bannerImageSrc: '/images/catalog/accessories.jpg',
  },
  fragrances: {
    href: '/catalog/fragrances',
    bannerImageSrc: '/images/catalog/perfume.jpg',
  },
  shoes: {
    href: '/catalog/shoes',
    bannerImageSrc: '/images/catalog/Rectangle19267.jpg',
  },
};
