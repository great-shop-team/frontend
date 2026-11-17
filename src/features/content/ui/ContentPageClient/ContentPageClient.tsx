'use client';

import type { InfoPageSlug } from '@/features/content/lib/infoPages';
import InfoPage from '@/features/content/ui/InfoPage/InfoPage';

type ContentPageClientProps = {
  slug: InfoPageSlug;
};

export default function ContentPageClient({ slug }: ContentPageClientProps) {
  return <InfoPage slug={slug} />;
}
