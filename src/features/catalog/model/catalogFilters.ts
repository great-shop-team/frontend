export type CatalogSortOption = 'featured' | 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc';

export type CatalogListingFilters = {
  subcategory?: string;
  type?: string;
  brand?: string[];
  color?: string[];
  size?: string[];
  sort?: CatalogSortOption;
};

export const CATALOG_SORT_OPTIONS: CatalogSortOption[] = [
  'featured',
  'price_asc',
  'price_desc',
  'name_asc',
  'name_desc',
];

export function isCatalogSortOption(value: string | null | undefined): value is CatalogSortOption {
  return Boolean(value && CATALOG_SORT_OPTIONS.includes(value as CatalogSortOption));
}

export function parseCsvParam(value: string | null | undefined): string[] {
  if (!value) return [];
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function toCsvParam(values: string[]): string | undefined {
  return values.length > 0 ? values.join(',') : undefined;
}
