'use client';

import { usePathname } from 'next/navigation';

import { hasBannerHeader } from '@/widgets/Header/headerBannerRoutes';

type MainContentProps = {
  children: React.ReactNode;
};

export default function MainContent({ children }: MainContentProps) {
  const pathname = usePathname();
  const isBannerPage = hasBannerHeader(pathname);

  return (
    <main className={isBannerPage ? undefined : 'pt-[var(--site-header-height)]'}>{children}</main>
  );
}
