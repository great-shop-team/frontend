'use client';

import Link from 'next/link';

import type { InfoPageSlug } from '@/features/content/lib/infoPages';
import { formatMessage, useTranslation } from '@/i18n/useTranslation';

const externalUrls: Partial<Record<InfoPageSlug, string>> = {
  instagram: 'https://www.instagram.com/',
  facebook: 'https://www.facebook.com/',
  tiktok: 'https://www.tiktok.com/',
};

type InfoPageProps = {
  slug: InfoPageSlug;
};

export default function InfoPage({ slug }: InfoPageProps) {
  const { t } = useTranslation();
  const page = t.infoPages[slug];
  const externalUrl = externalUrls[slug];

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
      {externalUrl ? (
        <a
          href={externalUrl}
          className="mt-6 inline-block rounded-lg bg-dark px-5 py-3 text-sm font-semibold text-white no-underline hover:opacity-90"
          target="_blank"
          rel="noopener noreferrer"
        >
          {formatMessage(t.infoPage.open, { title: page.title })}
        </a>
      ) : null}
    </article>
  );
}
