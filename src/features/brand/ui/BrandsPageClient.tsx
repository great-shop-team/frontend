'use client';

import { useMemo } from 'react';

import { useTranslation } from '@/i18n/useTranslation';
import { useGetBrandsQuery } from '@/store/endpoints/brandsEndpoints';

function groupBrands(brands: Array<{ name: string }>) {
  const grouped: Record<string, string[]> = {};

  brands
    .map((brand) => brand.name)
    .sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }))
    .forEach((name) => {
      const firstLetter = name.charAt(0).toUpperCase();
      const letter = /[A-Z]/.test(firstLetter) ? firstLetter : '0-9';

      if (!grouped[letter]) {
        grouped[letter] = [];
      }

      grouped[letter].push(name);
    });

  return grouped;
}

export default function BrandsPageClient() {
  const { t } = useTranslation();
  const { data: brands, isLoading, isError } = useGetBrandsQuery();

  const letterGroups = useMemo(() => groupBrands(brands ?? []), [brands]);

  const sections = useMemo(
    () =>
      Object.keys(letterGroups).sort((a, b) => {
        if (a === '0-9') return 1;
        if (b === '0-9') return -1;
        return a.localeCompare(b, 'en', { sensitivity: 'base' });
      }),
    [letterGroups],
  );

  if (isLoading) {
    return <p className="text-sm text-dark/70">{t.common.loading}</p>;
  }

  if (isError) {
    return <p className="text-sm text-red-600">{t.common.error}</p>;
  }

  if (!brands?.length) {
    return <p className="text-sm text-dark/70">{t.common.notFound}</p>;
  }

  return (
    <div className="space-y-12">
      <div className="mb-10 text-center">
        <h1 className="text-[clamp(2.5rem,4vw,4rem)] font-semibold tracking-tight text-dark">
          {t.nav.brands}
        </h1>
      </div>

      <div className="mb-8 overflow-x-auto pb-3">
        <div className="flex min-w-max flex-wrap items-center gap-4 text-xs font-semibold uppercase tracking-[0.24em] text-dark/60">
          {sections.map((letter) => (
            <a key={letter} href={`#${letter}`} className="transition-colors hover:text-dark">
              {letter}
            </a>
          ))}
        </div>
      </div>

      {sections.map((letter) => (
        <section
          key={letter}
          id={letter}
          className="border-t border-black/10 py-10 first:border-t-0"
        >
          <div className="grid items-start gap-8 lg:grid-cols-[5rem_minmax(0,1fr)]">
            <div className="flex items-start justify-start">
              <p className="text-[24px] font-black uppercase tracking-[0.08em] text-dark/90">
                {letter}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {letterGroups[letter].map((brand) => (
                <div
                  key={brand}
                  className="text-sm leading-7 text-dark/80 transition-colors hover:text-dark"
                >
                  {brand}
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
