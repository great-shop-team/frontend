'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState, type ReactNode } from 'react';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { useSessionEmail } from '@/features/auth/hooks/useSessionEmail';
import { useTranslation } from '@/i18n/useTranslation';
import { useGetProductsQuery } from '@/store/endpoints/productsEndpoints';
import { headerBarTextClass } from '@/widgets/Header/headerActionClasses';
import LanguageSwitcher from '@/widgets/LanguageSwitcher/LanguageSwitcher';

import { clearAdminPreview, isAdminPreview } from './adminPreview';
import { isAdminUser } from './isAdminUser';

type AdminShellProps = {
  children: ReactNode;
};

function sectionActive(pathname: string, href: string) {
  if (href === '/admin') return pathname === '/admin';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminShell({ children }: AdminShellProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, token, user, logoutUser } = useAuth();
  const { hasSession, email } = useSessionEmail();
  const products = useGetProductsQuery();
  const hasToken =
    typeof window !== 'undefined' ? Boolean(token) || Boolean(localStorage.getItem('accessToken')) : Boolean(token);
  const signedIn = isAuthenticated || hasSession || hasToken;
  const identityReady = Boolean(email) || Boolean(user);
  const isAdmin = isAdminUser(user, email);
  const [allowed, setAllowed] = useState(false);
  const [productsOpen, setProductsOpen] = useState(true);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (isAdminPreview() || isAdmin) {
      setAllowed(true);
      return;
    }

    setAllowed(false);

    if (!signedIn) {
      router.replace('/');
      return;
    }

    if (identityReady && !isAdmin) {
      router.replace('/profile');
    }
  }, [identityReady, isAdmin, router, signedIn]);

  if (!allowed) return null;

  const productCount = products.data?.length ?? 0;
  const dashboardActive = pathname === '/admin';
  const productsActive = sectionActive(pathname, '/admin/products');
  const ordersActive = sectionActive(pathname, '/admin/orders');
  const groups = [
    { href: '/admin/products', label: t.admin.clothing },
    { href: '/admin/products', label: t.admin.accessories },
    { href: '/admin/products', label: t.admin.perfume },
    { href: '/admin/products', label: t.admin.shoes },
  ];

  function exitAdmin() {
    clearAdminPreview();
    logoutUser();
    window.location.replace('/');
  }

  function onSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = search.trim();
    router.push(query ? `/admin/products?q=${encodeURIComponent(query)}` : '/admin/products');
  }

  return (
    <div className="flex h-dvh min-w-[1280px] bg-[#f3f4f6] text-[#1d2433]">
      <aside className="flex w-[248px] shrink-0 flex-col border-r border-[#eceef3] bg-white pb-20">
        <Link href="/admin" className="mb-4 flex h-[76px] items-center gap-2.5 px-6 text-[#1d2433] no-underline">
          <span className="inline-flex size-9 items-center justify-center rounded-xl bg-[#f3f6fb] text-[#1d2433]">
            <BagIcon />
          </span>
          <span className="font-(family-name:--font-unbounded) text-[15px] leading-none font-bold tracking-tight whitespace-nowrap">
            WEARLY SHOP
          </span>
        </Link>

        <div className="px-6 pb-2 text-[11px] font-semibold tracking-[0.14em] text-[#b0b6c3] uppercase">
          {t.admin.general}
        </div>

        <nav className="flex-1 overflow-y-auto px-3" aria-label={t.admin.open}>
          <Link
            href="/admin"
            aria-current={dashboardActive ? 'page' : undefined}
            className={`mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm no-underline ${
              dashboardActive ? 'bg-[#e8f1ff] font-semibold text-[#3b82f6]' : 'text-[#6b7280] hover:bg-[#f7f8fa]'
            }`}
          >
            <HomeIcon />
            {t.admin.dashboard}
          </Link>

          <div className={`rounded-xl ${productsActive ? 'bg-[#f7f9fc]' : ''}`}>
            <div className="flex items-center">
              <Link
                href="/admin/products"
                className={`flex min-w-0 flex-1 items-center gap-3 rounded-xl px-3 py-2.5 text-sm no-underline ${
                  productsActive ? 'font-semibold text-[#1d2433]' : 'text-[#6b7280]'
                }`}
              >
                <BoxIcon />
                <span className="truncate">
                  {t.admin.products} ({productCount})
                </span>
              </Link>
              <button
                type="button"
                className="mr-2 inline-flex size-8 cursor-pointer items-center justify-center border-0 bg-transparent text-[#9aa1ad]"
                aria-expanded={productsOpen}
                onClick={() => setProductsOpen((open) => !open)}
              >
                <Chevron open={productsOpen} />
              </button>
            </div>
            {productsOpen ? (
              <div className="mt-1 mb-2 ml-7 border-l border-[#e6e8ee] pl-4">
                {groups.map((group) => (
                  <Link
                    key={group.label}
                    href={group.href}
                    className="block py-1.5 text-sm text-[#8b93a1] no-underline hover:text-[#1d2433]"
                  >
                    {group.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>

          <div className="mt-1 flex items-center">
            <Link
              href="/admin/orders"
              aria-current={ordersActive ? 'page' : undefined}
              className={`flex min-w-0 flex-1 items-center gap-3 rounded-xl px-3 py-2.5 text-sm no-underline ${
                ordersActive ? 'bg-[#e8f1ff] font-semibold text-[#3b82f6]' : 'text-[#6b7280] hover:bg-[#f7f8fa]'
              }`}
            >
              <OrdersIcon />
              {t.admin.orders}
            </Link>
            <button
              type="button"
              className="mr-2 inline-flex size-8 cursor-pointer items-center justify-center border-0 bg-transparent text-[#9aa1ad]"
              aria-expanded={ordersOpen}
              onClick={() => setOrdersOpen((open) => !open)}
            >
              <Chevron open={ordersOpen} />
            </button>
          </div>
          {ordersOpen ? (
            <Link
              href="/admin/orders"
              className="mb-2 ml-11 block py-1.5 text-sm text-[#8b93a1] no-underline hover:text-[#1d2433]"
            >
              {t.admin.showAll}
            </Link>
          ) : null}
        </nav>

        <div className="px-4">
          <Link
            href="/admin/profile"
            className={`mb-3 flex items-center gap-3 rounded-2xl border px-3 py-2.5 text-[#1d2433] no-underline ${
              pathname === '/admin/profile' ? 'border-[#3b82f6] bg-[#e8f1ff]' : 'border-[#eceef3]'
            }`}
          >
            <span className="inline-flex size-10 items-center justify-center overflow-hidden rounded-full bg-[#eef1f6] text-[#6b7280]">
              <PersonIcon />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold">Admin</span>
              <span className="block truncate text-xs text-[#9aa1ad]">{email?.split('@')[0] || t.admin.role}</span>
            </span>
          </Link>
          <button
            type="button"
            onClick={exitAdmin}
            className="w-full cursor-pointer rounded-xl border-0 bg-[#ff3b3b] px-5 py-2.5 text-sm font-bold text-white"
          >
            {t.admin.logout}
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="z-10 flex h-[76px] shrink-0 items-center justify-between gap-6 bg-white px-6 shadow-[0_8px_18px_-6px_rgb(29_36_51/18%)]">
          <form onSubmit={onSearch} className="relative w-full max-w-[420px]">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t.admin.find}
              aria-label={t.admin.find}
              className="h-10 w-full rounded-xl border border-[#e4e7ee] bg-white pr-10 pl-4 text-sm outline-none placeholder:text-[#b0b6c3] focus:border-[#3b82f6]"
            />
            <button
              type="submit"
              className="absolute top-1/2 right-3 inline-flex -translate-y-1/2 cursor-pointer border-0 bg-transparent p-0 text-[#9aa1ad]"
              aria-label={t.admin.find}
            >
              <SearchIcon />
            </button>
          </form>
          <div className={`flex items-center gap-8 text-[#1d2433] ${headerBarTextClass}`}>
              <Link
                href="/"
                aria-label={t.admin.toStore}
                className="inline-flex size-10 items-center justify-center text-inherit no-underline"
              >
                <PersonIcon className="size-6" />
              </Link>
              <div aria-hidden className="h-10 w-px shrink-0 bg-gray/40" />
              <LanguageSwitcher variant="dropdown" />
            </div>
          </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 pt-6 pb-8">{children}</div>
      </div>
    </div>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 20 20" className={`size-4 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="m5 8 5 5 5-5" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 8h12l-1 12H7L6 8Z" />
      <path strokeLinecap="round" d="M9 8V7a3 3 0 0 1 6 0v1" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" />
    </svg>
  );
}

function BoxIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="m4 8 8-4 8 4-8 4-8-4Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 8v8l8 4 8-4V8" />
      <path strokeLinecap="round" d="m12 12 0 8" />
    </svg>
  );
}

function OrdersIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h11M8 12h11M8 17h11" />
      <path strokeLinecap="round" d="M4.5 7h.01M4.5 12h.01M4.5 17h.01" />
    </svg>
  );
}

function PersonIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <circle cx="12" cy="8" r="3" />
      <path strokeLinecap="round" d="M5 19a7 7 0 0 1 14 0" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <circle cx="11" cy="11" r="6" />
      <path strokeLinecap="round" d="m16 16 4 4" />
    </svg>
  );
}
