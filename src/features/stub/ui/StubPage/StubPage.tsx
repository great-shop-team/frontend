'use client';

import Link from 'next/link';

import { useTranslation } from '@/i18n/useTranslation';

type StubPageKey = 'wishlist' | 'cart' | 'checkout' | 'sales';

type StubPageProps = {
  pageKey: StubPageKey;
};

export default function StubPage({ pageKey }: StubPageProps) {
  const { t } = useTranslation();
  const page = t.stub[pageKey];

  return (
    <article className="layout-gutter mx-auto max-w-[720px] py-12 pb-20">
      <Link
        href="/"
        className="mb-6 inline-block text-sm text-gray no-underline hover:text-dark hover:underline"
      >
        {t.infoPage.backToHome}
      </Link>
      <h1 className="m-0 mb-4 font-(family-name:--font-unbounded) text-[32px] font-semibold text-dark">
        {page.title}
      </h1>
      <p className="m-0 text-base leading-relaxed text-dark">{page.description}</p>
      <Link
        href="/catalog"
        className="mt-6 inline-block rounded-lg bg-dark px-5 py-3 text-sm font-semibold text-white no-underline hover:opacity-90"
      >
        {page.cta}
      </Link>
    </article>
  );
}
