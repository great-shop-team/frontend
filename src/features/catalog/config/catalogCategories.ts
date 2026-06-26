import type { CatalogCategory } from '@/features/catalog/model/catalogCategory';

type CatalogCategoryConfig = {
  href: `/catalog/${CatalogCategory}`;
  bannerImageSrc: string;
};

export const catalogCategoriesConfig: Record<CatalogCategory, CatalogCategoryConfig> = {
  women: {
    href: '/catalog/women',
    bannerImageSrc: '/images/heroBanner.jpg',
  },
  men: {
    href: '/catalog/men',
    bannerImageSrc: '/images/heroBanner.jpg',
  },
  unisex: {
    href: '/catalog/unisex',
    bannerImageSrc: '/images/heroBanner.jpg',
  },
  accessories: {
    href: '/catalog/accessories',
    bannerImageSrc: '/images/heroBanner.jpg',
  },
  perfumes: {
    href: '/catalog/perfumes',
    bannerImageSrc: '/images/perfume.png',
  },
};
