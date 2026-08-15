'use client';

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
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
import MobileNav from '@/widgets/Header/MobileNav';
import { useTranslation } from '@/i18n/useTranslation';
import { useAuthOverlay } from '@/features/auth/context/AuthOverlayContext';

const scrollThreshold = 24;

export default function Header() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const bannerHeader = hasBannerHeader(pathname);
  const [scrollY, setScrollY] = useState(0);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isLandingBannerVisible, setIsLandingBannerVisible] = useState(true);
  const headerRef = useRef<HTMLElement>(null);
  const { closeAuth, isOpen: isAuthOpen } = useAuthOverlay();

  const closeMobileNav = useCallback(() => {
    setIsMobileNavOpen(false);
  }, []);

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

  const isLanding = pathname === '/';
  const showLandingBanner = isLanding && isLandingBannerVisible && !isAuthOpen;
  const isTransparent =
    bannerHeader && scrollY <= scrollThreshold && !isMobileNavOpen && !isAuthOpen;

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return undefined;

    const syncOffset = () => {
      document.documentElement.style.setProperty('--site-header-offset', `${el.offsetHeight}px`);
    };

    syncOffset();
    const observer = new ResizeObserver(syncOffset);
    observer.observe(el);

    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty('--site-header-offset');
    };
  }, [showLandingBanner, isAuthOpen, isMobileNavOpen]);

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 right-0 left-0 z-100 w-full transition-[background-color,color,box-shadow] duration-300 ease-in-out ${
        isTransparent
          ? 'bg-transparent text-white [&_.header-logo]:brightness-0 [&_.header-logo]:invert'
          : 'bg-white text-dark shadow-[inset_0_-6px_20px_-8px_rgb(0_0_0/9%)]'
      }`}
    >
      {showLandingBanner ? (
        <div className="bg-white text-black">
          <div className="relative mx-auto flex min-h-10 items-center justify-center py-2 pl-3 pr-11 md:h-10 md:py-0 md:pl-[var(--header-padding-x)] md:pr-14">
            <p className="m-0 max-w-full text-center text-[12px] leading-snug font-medium tracking-tight md:text-sm">
              <span className="md:hidden">{t.landing.topBanner.textMobile}</span>
              <span className="hidden md:inline">{t.landing.topBanner.text}</span>
            </p>
            <button
              type="button"
              onClick={() => setIsLandingBannerVisible(false)}
              className="absolute top-1/2 right-0.5 inline-flex size-10 -translate-y-1/2 items-center justify-center text-black md:right-3 md:size-8"
              aria-label={t.landing.topBanner.close}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-4 w-4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
        </div>
      ) : null}

      <div
        className={`mx-auto box-border flex h-[var(--site-header-height)] w-full max-w-[var(--layout-max-width)] items-center justify-between px-[var(--header-padding-x)] py-[var(--header-padding-y)] ${headerBarTextClass}`}
      >
        <div className="flex h-full min-w-0 items-center gap-3 lg:gap-24">
          <button
            type="button"
            className="inline-flex size-10 shrink-0 cursor-pointer items-center justify-center border-none bg-transparent p-0 text-inherit lg:hidden"
            aria-label={isMobileNavOpen ? t.nav.closeMenu : t.nav.openMenu}
            aria-expanded={isMobileNavOpen}
            aria-controls="mobile-nav"
            onClick={() => {
              setIsMobileNavOpen((prev) => {
                const next = !prev;
                if (next) closeAuth();
                return next;
              });
            }}
          >
            {isMobileNavOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            )}
          </button>

          <Logo />
          <div className="hidden h-full lg:block">
            <Navigation />
          </div>
        </div>

        <div className="flex shrink-0 items-center">
          <div className="flex items-center gap-0.5 sm:gap-3 lg:gap-4">
            <Search
              onOpen={() => {
                closeMobileNav();
                closeAuth();
              }}
            />
            <Suspense fallback={null}>
              <MyAccount isHeaderTransparent={isTransparent} />
            </Suspense>
            <WishList />
            <ShoppingBag />
          </div>

          <div className="ml-8 hidden items-center gap-8 lg:flex">
            <div
              aria-hidden
              className={`h-10 w-px shrink-0 ${isTransparent ? 'bg-white/80' : 'bg-gray/40'}`}
            />
            <LanguageSwitcher variant="dropdown" />
          </div>
        </div>
      </div>

      <MobileNav isOpen={isMobileNavOpen} onClose={closeMobileNav} />
    </header>
  );
}
