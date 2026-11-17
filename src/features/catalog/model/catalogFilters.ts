export type CatalogSortOption =
  | 'featured'
  | 'price_asc'
  | 'price_desc'
  | 'newest'
  | 'bestsellers';

export type CatalogGenderFilter = 'men' | 'women';
export type CatalogGroupFilter = 'clothing' | 'accessories' | 'fragrances';

export type CatalogListingFilters = {
  q?: string;
  subcategory?: string[];
  type?: string;
  gender?: CatalogGenderFilter[];
  group?: CatalogGroupFilter[];
  brand?: string[];
  color?: string[];
  size?: string[];
  sort?: CatalogSortOption;
};

export const CATALOG_SORT_OPTIONS: CatalogSortOption[] = [
  'featured',
  'price_asc',
  'price_desc',
  'newest',
  'bestsellers',
];

export const CATALOG_GENDER_FILTERS: CatalogGenderFilter[] = ['men', 'women'];
export const CATALOG_GROUP_FILTERS: CatalogGroupFilter[] = [
  'clothing',
  'accessories',
  'fragrances',
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

export function isCatalogGenderFilter(value: string): value is CatalogGenderFilter {
  return CATALOG_GENDER_FILTERS.includes(value as CatalogGenderFilter);
}

export function isCatalogGroupFilter(value: string): value is CatalogGroupFilter {
  return CATALOG_GROUP_FILTERS.includes(value as CatalogGroupFilter);
}

export function parseGenderParams(value: string | null | undefined): CatalogGenderFilter[] {
  return parseCsvParam(value).filter(isCatalogGenderFilter);
}

export function parseGroupParams(value: string | null | undefined): CatalogGroupFilter[] {
  return parseCsvParam(value).filter(isCatalogGroupFilter);
}

/** Empty or a complete set means “no restriction” in the URL. */
export function toPartialCsvParam(selected: string[], allValues: string[]): string | undefined {
  if (selected.length === 0 || (allValues.length > 0 && selected.length === allValues.length)) {
    return undefined;
  }
  return toCsvParam(selected);
}
