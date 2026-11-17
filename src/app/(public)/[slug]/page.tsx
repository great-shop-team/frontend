import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import ContentPageClient from '@/features/content/ui/ContentPageClient/ContentPageClient';
import { isInfoPageSlug } from '@/features/content/lib/infoPages';
import { getDictionary } from '@/i18n/dictionaries';
import { defaultLocale } from '@/i18n/config';

type PageProps = {
  params: Promise<{ slug: string }>;
};

const infoPageSlugs = [
  'about',
  'careers',
  'contacts',
  'shipping',
  'returns',
  'faq',
  'size-guide',
  'privacy',
  'terms',
  'cookies',
  'instagram',
  'facebook',
  'tiktok',
] as const;

export function generateStaticParams() {
  return infoPageSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  if (!isInfoPageSlug(slug)) {
    return { title: getDictionary(defaultLocale).common.notFound };
  }

  const page = getDictionary(defaultLocale).infoPages[slug];

  return { title: page.title };
}

export default async function ContentPage({ params }: PageProps) {
  const { slug } = await params;

  if (!isInfoPageSlug(slug)) {
    notFound();
  }

  return <ContentPageClient slug={slug} />;
}
