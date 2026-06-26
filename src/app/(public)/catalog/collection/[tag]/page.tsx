import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import CatalogCollectionPage from '@/features/catalog/ui/CatalogCollectionPage/CatalogCollectionPage';
import {
  CATALOG_COLLECTION_SLUGS,
  collectionSlugToI18nKey,
  isCatalogCollectionSlug,
} from '@/features/catalog/model/catalogCollection';
import { getDictionary } from '@/i18n/dictionaries';
import { defaultLocale } from '@/i18n/config';

type CollectionPageProps = {
  params: Promise<{ tag: string }>;
};

export function generateStaticParams() {
  return CATALOG_COLLECTION_SLUGS.map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { tag } = await params;

  if (!isCatalogCollectionSlug(tag)) {
    return {};
  }

  const dictionary = getDictionary(defaultLocale);
  const copyKey = collectionSlugToI18nKey(tag);

  return {
    title: dictionary.catalog.collections[copyKey].title,
  };
}

export default async function CollectionCatalogPage({ params }: CollectionPageProps) {
  const { tag } = await params;

  if (!isCatalogCollectionSlug(tag)) {
    notFound();
  }

  return <CatalogCollectionPage collection={tag} />;
}
