export const CATALOG_CATEGORY_SLUGS = [
  'women',
  'men',
  'unisex',
  'accessories',
  'perfumes',
] as const;

export type CatalogCategory = (typeof CATALOG_CATEGORY_SLUGS)[number];

export function isCatalogCategory(value: string): value is CatalogCategory {
  return CATALOG_CATEGORY_SLUGS.includes(value as CatalogCategory);
}
