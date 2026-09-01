import { Suspense } from 'react';
import type { Metadata } from 'next';

import CatalogPage from '@/features/catalog/ui/CatalogPage/CatalogPage';
import { getDictionary } from '@/i18n/dictionaries';
import { defaultLocale } from '@/i18n/config';

export function generateMetadata(): Metadata {
  return { title: getDictionary(defaultLocale).catalog.title };
}

export default function CatalogIndexPage() {
  return (
    <Suspense fallback={null}>
      <CatalogPage category="all" />
    </Suspense>
  );
}
