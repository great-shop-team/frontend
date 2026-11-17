'use client';

import { useSelector } from 'react-redux';

import { useCartDrawer } from '@/features/cart/context/CartDrawerContext';
import { useTranslation } from '@/i18n/useTranslation';
import type { RootState } from '@/store/store';
import { getHeaderActionClass } from '@/widgets/Header/headerActionClasses';

export default function ShoppingBag() {
  const { t } = useTranslation();
  const { isOpen, openCart, closeCart } = useCartDrawer();
  const count = useSelector((state: RootState) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0),
  );
  const countLabel = count > 9 ? '9+' : String(count);
  const ariaLabel = count > 0 ? `${t.cartDrawer.open} (${count})` : t.cartDrawer.open;

  return (
    <button
      type="button"
      className={getHeaderActionClass(isOpen)}
      aria-label={ariaLabel}
      aria-expanded={isOpen}
      onClick={() => {
        if (isOpen) closeCart();
        else openCart();
      }}
    >
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
            d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
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
    </button>
  );
}
