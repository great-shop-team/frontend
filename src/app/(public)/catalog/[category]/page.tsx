import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import CatalogPage from '@/features/catalog/ui/CatalogPage/CatalogPage';
import {
  isCatalogListingSlug,
  CATALOG_LISTING_SLUGS,
} from '@/features/catalog/model/catalogCategory';
import { getDictionary } from '@/i18n/dictionaries';
import { defaultLocale } from '@/i18n/config';

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

export function generateStaticParams() {
  return CATALOG_LISTING_SLUGS.map((category) => ({ category }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;

  if (!isCatalogListingSlug(category)) {
    return {};
  }

  const dictionary = getDictionary(defaultLocale);

  return {
    title: dictionary.catalog.categories[category].title,
  };
}

export default async function CategoryCatalogPage({ params }: CategoryPageProps) {
  const { category } = await params;

  if (!isCatalogListingSlug(category)) {
    notFound();
  }

  return (
    <Suspense fallback={null}>
      <CatalogPage category={category} />
    </Suspense>
  );
}
