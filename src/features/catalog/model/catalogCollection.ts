export const CATALOG_COLLECTION_SLUGS = ['new-collection', 'bestsellers', 'gift-ideas'] as const;

export type CatalogCollectionSlug = (typeof CATALOG_COLLECTION_SLUGS)[number];

const COLLECTION_TAG_MAP: Record<CatalogCollectionSlug, string> = {
  'new-collection': 'New Collection',
  bestsellers: 'Bestsellers',
  'gift-ideas': 'Gift Ideas',
};

export function isCatalogCollectionSlug(value: string): value is CatalogCollectionSlug {
  return CATALOG_COLLECTION_SLUGS.includes(value as CatalogCollectionSlug);
}

export function getCollectionTag(slug: CatalogCollectionSlug): string {
  return COLLECTION_TAG_MAP[slug];
}

export function collectionSlugToI18nKey(
  slug: CatalogCollectionSlug,
): 'newCollection' | 'bestsellers' | 'giftIdeas' {
  switch (slug) {
    case 'new-collection':
      return 'newCollection';
    case 'bestsellers':
      return 'bestsellers';
    case 'gift-ideas':
      return 'giftIdeas';
  }
}
