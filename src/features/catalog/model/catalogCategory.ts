export const CATALOG_CATEGORY_SLUGS = ['men', 'women', 'accessories'] as const;
export const CATALOG_LISTING_SLUGS = ['men', 'women', 'accessories', 'fragrances', 'shoes'] as const;

export type CatalogCategory = (typeof CATALOG_CATEGORY_SLUGS)[number];
export type CatalogListingSlug = (typeof CATALOG_LISTING_SLUGS)[number];
export type CatalogScope = CatalogListingSlug | 'all';
export type CatalogProductGroup = 'clothing' | 'accessories' | 'fragrances';

export function isCatalogCategory(value: string): value is CatalogCategory {
  return CATALOG_CATEGORY_SLUGS.includes(value as CatalogCategory);
}

export function isCatalogListingSlug(value: string): value is CatalogListingSlug {
  return CATALOG_LISTING_SLUGS.includes(value as CatalogListingSlug);
}

export function isCatalogScope(value: string): value is CatalogScope {
  return value === 'all' || isCatalogListingSlug(value);
}

export function isFragranceSubcategory(subcategory?: { slug?: string; name?: string } | string) {
  const value =
    typeof subcategory === 'string'
      ? subcategory
      : `${subcategory?.slug ?? ''} ${subcategory?.name ?? ''}`;

  return /fragran|perfume|parfum/i.test(value);
}

export function resolveProductCatalogCategory(args: {
  productName: string;
  subcategoryCategoryId?: number;
  subcategorySlug?: string;
  subcategoryName?: string;
  categoryIdBySlug: Map<string, number>;
  genders: Array<'male' | 'female' | 'unisex'>;
}): CatalogCategory {
  const {
    productName,
    subcategoryCategoryId,
    subcategorySlug,
    subcategoryName,
    categoryIdBySlug,
    genders,
  } = args;

  if (isFragranceSubcategory({ slug: subcategorySlug, name: subcategoryName })) {
    return 'accessories';
  }

  if (subcategoryCategoryId === categoryIdBySlug.get('accessories')) {
    return 'accessories';
  }

  if (genders.length > 0) {
    const hasMale = genders.some((gender) => gender === 'male');
    const hasFemale = genders.some((gender) => gender === 'female');
    if (hasMale && !hasFemale) return 'men';
    if (hasFemale) return 'women';
  }

  const name = productName.toLowerCase();
  if (/\bwom[ae]n'?s?\b|\bfemale\b|\bladies\b/.test(name)) return 'women';
  if (/\bmen'?s?\b|\bmale\b|\bman\b/.test(name) && !/\bwom/.test(name)) return 'men';

  return 'women';
}

export function resolveProductGroup(args: {
  subcategorySlug?: string;
  subcategoryName?: string;
  subcategoryCategoryId?: number;
  categoryIdBySlug: Map<string, number>;
}): CatalogProductGroup {
  const { subcategorySlug, subcategoryName, subcategoryCategoryId, categoryIdBySlug } = args;

  if (isFragranceSubcategory({ slug: subcategorySlug, name: subcategoryName })) {
    return 'fragrances';
  }

  if (subcategoryCategoryId === categoryIdBySlug.get('accessories')) {
    return 'accessories';
  }

  return 'clothing';
}
