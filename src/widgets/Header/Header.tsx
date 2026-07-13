'use client';

import { Suspense, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

import LanguageSwitcher from '@/widgets/LanguageSwitcher/LanguageSwitcher';
import Logo from '@/widgets/Logo/Logo';
import Navigation from '@/widgets/Navigation/Navigation';
import Search from '@/widgets/Search/Search';
import MyAccount from '@/widgets/MyAccount/MyAccount';
import WishList from '@/widgets/WishList/WishList';
import ShoppingBag from '@/widgets/ShoppingBag/ShoppingBag';
import { headerBarTextClass } from '@/widgets/Header/headerActionClasses';
import { hasBannerHeader } from '@/widgets/Header/headerBannerRoutes';

const scrollThreshold = 24;

export default function Header() {
  const pathname = usePathname();
  const bannerHeader = hasBannerHeader(pathname);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (!bannerHeader) {
      return undefined;
    }

    const onScroll = () => {
      setScrollY(window.scrollY);
    };

    const frame = requestAnimationFrame(onScroll);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };
  }, [bannerHeader, pathname]);

  const isTransparent = bannerHeader && scrollY <= scrollThreshold;

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-100 w-full transition-[background-color,color,box-shadow] duration-300 ease-in-out ${
        isTransparent
          ? 'bg-transparent text-white [&_.header-logo]:brightness-0 [&_.header-logo]:invert'
          : 'bg-white text-dark shadow-[inset_0_-6px_20px_-8px_rgb(0_0_0/9%)]'
      }`}
    >
      <div
        className={`mx-auto box-border flex h-(--site-header-height) w-full max-w-(--layout-max-width) items-center justify-between px-(--header-padding-x) py-(--header-padding-y) ${headerBarTextClass}`}
      >
        <div className="flex min-w-0 items-center gap-24">
          <Logo />
          <Navigation />
        </div>

        <div className="flex shrink-0 items-center">
          <div className="flex items-center gap-4">
            <Search />
            <Suspense fallback={null}>
              <MyAccount isHeaderTransparent={isTransparent} />
            </Suspense>
            <WishList />
            <ShoppingBag />
          </div>

          <div className="ml-8 flex items-center gap-8">
            <div
              aria-hidden
              className={`h-10 w-px shrink-0 ${isTransparent ? 'bg-white/80' : 'bg-gray/40'}`}
            />
            <LanguageSwitcher variant="dropdown" />
          </div>
        </div>
      </div>
    </header>
  );
}
