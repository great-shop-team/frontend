import type { CatalogCategory } from '@/features/catalog/model/catalogCategory';

import { catalogCategoriesConfig } from './catalogCategories';

type CatalogQuery = {
  subcategory?: string;
  type?: string;
};

export function buildCatalogHref(category: CatalogCategory, query?: CatalogQuery): string {
  const base = catalogCategoriesConfig[category].href;

  if (!query?.subcategory && !query?.type) {
    return base;
  }

  const params = new URLSearchParams();

  if (query.subcategory) {
    params.set('subcategory', query.subcategory);
  }

  if (query.type) {
    params.set('type', query.type);
  }

  return `${base}?${params.toString()}`;
}

export const catalogRoutes = {
  index: '/catalog',
  sales: '/sales',
  newArrivals: '/#new-arrivals',
  women: catalogCategoriesConfig.women.href,
  men: catalogCategoriesConfig.men.href,
  accessories: catalogCategoriesConfig.accessories.href,
  perfumes: buildCatalogHref('accessories', { subcategory: 'fragrances' }),
  womenClothing: buildCatalogHref('women', { subcategory: 'clothing' }),
  menClothing: buildCatalogHref('men', { subcategory: 'clothing' }),
  sport: catalogCategoriesConfig.men.href,
  shoes: buildCatalogHref('women', { subcategory: 'shoes' }),
  bags: catalogCategoriesConfig.accessories.href,
  jewellery: catalogCategoriesConfig.accessories.href,
  beauty: buildCatalogHref('accessories', { subcategory: 'fragrances' }),
} as const;
