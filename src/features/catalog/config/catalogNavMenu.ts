import { CATALOG_CATEGORY_SLUGS } from '@/features/catalog/model/catalogCategory';
import type { CatalogCollectionSlug } from '@/features/catalog/model/catalogCollection';

export const catalogNavCategories = CATALOG_CATEGORY_SLUGS;

export const catalogNavCollections: { slug: CatalogCollectionSlug; emoji: string }[] = [
  { slug: 'new-collection', emoji: '✨' },
  { slug: 'bestsellers', emoji: '🔥' },
  { slug: 'gift-ideas', emoji: '🎁' },
];
