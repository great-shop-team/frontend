'use client';

import { useWishlist } from '@/features/wishlist/hooks/useWishlist';
import { useTranslation } from '@/i18n/useTranslation';

type WishlistButtonProps = {
  productId: string;
  className?: string;
  iconClassName?: string;
};

export default function WishlistButton({
  productId,
  className = 'cursor-pointer border-none bg-transparent p-1 text-dark transition-transform hover:scale-110',
  iconClassName = 'size-5',
}: WishlistButtonProps) {
  const { t } = useTranslation();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isActive = isInWishlist(productId);

  return (
    <button
      type="button"
      className={className}
      onClick={() => toggleWishlist(productId)}
      aria-label={t.landing.addToWishlist}
      aria-pressed={isActive}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill={isActive ? 'currentColor' : 'none'}
        viewBox="0 0 24 24"
        strokeWidth={1.2}
        stroke="currentColor"
        className={iconClassName}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
        />
      </svg>
    </button>
  );
}
