import type { Metadata } from 'next';

import { getDictionary } from '@/i18n/dictionaries';
import { defaultLocale } from '@/i18n/config';

export function generateMetadata(): Metadata {
  const dictionary = getDictionary(defaultLocale);

  return {
    title: dictionary.nav.shopMenu.type,
  };
}

export default function TypesPage() {
  const dictionary = getDictionary(defaultLocale);

  return (
    <main className="mx-auto max-w-screen-2xl px-6 py-10 sm:px-8 lg:px-12">
      <div className="mb-10 text-center">
        <h1 className="text-[clamp(2.5rem,4vw,4rem)] font-semibold tracking-tight text-dark">
          {dictionary.nav.shopMenu.type}
        </h1>
      </div>

      <section className="rounded-3xl border border-black/5 bg-white px-6 py-8 shadow-[0_28px_80px_rgb(16_24_40/4%)] sm:px-8">
        <p className="text-lg text-dark/70">
          {dictionary.nav.shopMenu.type} page placeholder. Тут можна додати список типів або фільтр
          за типами.
        </p>
      </section>
    </main>
  );
}
