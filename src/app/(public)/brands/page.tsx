import type { Metadata } from 'next';

import { getDictionary } from '@/i18n/dictionaries';
import { defaultLocale } from '@/i18n/config';
import BrandsPageClient from '@/features/brand/ui/BrandsPageClient';

export function generateMetadata(): Metadata {
  const dictionary = getDictionary(defaultLocale);

  return {
    title: dictionary.nav.brands,
  };
}

export default function BrandsPage() {
  return (
    <main id="top" className="mx-auto max-w-screen-2xl px-6 py-10 sm:px-8 lg:px-12">
      <BrandsPageClient />
    </main>
  );
}
