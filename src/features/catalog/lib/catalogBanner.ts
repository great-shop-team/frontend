import { catalogCategoriesConfig } from '@/features/catalog/config/catalogCategories';
import type { CatalogScope } from '@/features/catalog/model/catalogCategory';

const ALL_CATALOG_BANNER = '/images/heroBanner.jpg';

/** Banner image path for a catalog category (files live in /public). */
export function getCatalogBannerImageSrc(category: CatalogScope) {
  if (category === 'all') return ALL_CATALOG_BANNER;
  return catalogCategoriesConfig[category].bannerImageSrc;
}
