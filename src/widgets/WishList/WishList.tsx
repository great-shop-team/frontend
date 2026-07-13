'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useSessionEmail } from '@/features/auth/hooks/useSessionEmail';
import { useWishlistAuth } from '@/features/wishlist/context/WishlistAuthProvider';
import { useWishlist } from '@/features/wishlist/hooks/useWishlist';
import { useTranslation } from '@/i18n/useTranslation';
import { getHeaderActionClass, isActivePath } from '@/widgets/Header/headerActionClasses';

export default function WishList() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const { hasSession } = useSessionEmail();
  const { requireAuth } = useWishlistAuth();
  const { items } = useWishlist();
  const isActive = isActivePath(pathname, '/profile');
  const count = hasSession ? items.length : 0;
  const countLabel = count > 9 ? '9+' : String(count);

  const heartIcon = (
    <span className="relative inline-flex">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
        />
      </svg>
      {count > 0 ? (
        <span
          className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[10px] leading-none font-medium text-white"
          aria-hidden
        >
          {countLabel}
        </span>
      ) : null}
    </span>
  );

  const ariaLabel = count > 0 ? `${t.account.wishlist} (${count})` : t.account.wishlist;

  if (!hasSession) {
    return (
      <button
        type="button"
        className={getHeaderActionClass(isActive)}
        aria-label={ariaLabel}
        onClick={() => requireAuth()}
      >
        {heartIcon}
      </button>
    );
  }

  return (
    <Link
      href="/profile"
      className={getHeaderActionClass(isActive)}
      aria-current={isActive ? 'page' : undefined}
      aria-label={ariaLabel}
    >
      {heartIcon}
    </Link>
  );
}
