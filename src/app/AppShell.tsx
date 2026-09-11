'use client';

import Header from '@/widgets/Header/Header';
import Footer from '@/widgets/Footer/Footer';
import MainContent from '@/widgets/MainContent/MainContent';
import ScrollToTop from '@/widgets/ScrollToTop/ScrollToTop';
import { usePathname } from 'next/navigation';

type AppShellProps = {
  children: React.ReactNode;
};

const PLAIN_LAYOUT_PATHS = new Set(['/401', '/404', '/500']);

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isPlainLayout = PLAIN_LAYOUT_PATHS.has(pathname);

  if (isPlainLayout) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <div className="layout-container flex flex-1 flex-col">
        <div className="flex-1">
          <MainContent>{children}</MainContent>
        </div>
      </div>
      <Footer />
      <ScrollToTop />
    </>
  );
}
