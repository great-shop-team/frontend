import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import CatalogPage from '@/features/catalog/ui/CatalogPage/CatalogPage';
import {
  isCatalogCategory,
  CATALOG_CATEGORY_SLUGS,
} from '@/features/catalog/model/catalogCategory';
import { getDictionary } from '@/i18n/dictionaries';
import { defaultLocale } from '@/i18n/config';

type CategoryPageProps = {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ subcategory?: string; type?: string }>;
};

export function generateStaticParams() {
  return CATALOG_CATEGORY_SLUGS.map((category) => ({ category }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;

  if (!isCatalogCategory(category)) {
    return {};
  }

  const dictionary = getDictionary(defaultLocale);

  return {
    title: dictionary.catalog.categories[category].title,
  };
}

export default async function CategoryCatalogPage({ params, searchParams }: CategoryPageProps) {
  const { category } = await params;
  const { subcategory, type } = await searchParams;

  if (!isCatalogCategory(category)) {
    notFound();
  }

  return <CatalogPage category={category} filters={{ subcategory, type }} />;
}
