'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useCartDrawer } from '@/features/cart/context/CartDrawerContext';
import { useTranslation } from '@/i18n/useTranslation';
import type { RootState } from '@/store/store';
import { removeFromCart, setCartItemQuantity } from '@/store/slices/cartSlice';
import type { CartItem } from '@/store/types';

const DRAWER_ANIMATION_MS = 300;

const formatCartPrice = (amount: number, currency: string) => {
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
  return currency === 'USD' ? `$${formatted}` : `${formatted} ${currency}`;
};

export default function CartDrawer() {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();
  const { isOpen, closeCart } = useCartDrawer();
  const items = useSelector((state: RootState) => state.cart.items);
  const [isRendered, setIsRendered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useLayoutEffect(() => {
    if (!isOpen) {
      setIsVisible(false);
      return;
    }

    setIsRendered(true);
  }, [isOpen]);

  useLayoutEffect(() => {
    if (!isRendered || !isOpen) return undefined;

    const frame = window.requestAnimationFrame(() => {
      setIsVisible(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [isOpen, isRendered]);

  useEffect(() => {
    if (!isRendered || isVisible) return undefined;

    const timeout = window.setTimeout(() => {
      setIsRendered(false);
    }, DRAWER_ANIMATION_MS);

    return () => window.clearTimeout(timeout);
  }, [isRendered, isVisible]);

  useEffect(() => {
    if (!isRendered) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeCart();
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [closeCart, isRendered]);

  if (!isRendered) return null;

  const cartItems = items.filter(
    (item) => typeof item.price === 'number' && typeof item.title === 'string',
  );
  const estimatedTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const currency = cartItems[0]?.currency ?? 'USD';

  const changeQuantity = (item: CartItem, nextQuantity: number) => {
    dispatch(
      setCartItemQuantity({
        productId: item.productId,
        variantId: item.variantId,
        quantity: nextQuantity,
      }),
    );
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-130 bg-black/10 transition-[opacity,backdrop-filter] duration-300 ${
          isVisible ? 'opacity-100 backdrop-blur-sm' : 'opacity-0 backdrop-blur-none'
        }`}
        onClick={closeCart}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={t.cartDrawer.title}
        className={`fixed inset-y-0 right-0 z-131 flex h-dvh w-full max-w-[582px] flex-col bg-white p-3 shadow-[-4px_0_24px_rgb(0_0_0/10%)] transition-transform duration-300 ease-out ${
          isVisible ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-8 items-center justify-between">
          <p className="m-0 font-sans text-[16px] leading-[1.2] font-normal text-black/70">
            {t.cartDrawer.title}
          </p>
          <button
            type="button"
            onClick={closeCart}
            aria-label={t.cartDrawer.close}
            className="inline-flex size-8 items-center justify-center border-none bg-transparent p-0"
          >
            <Image
              src="/images/catalog/close-icon-x.svg"
              alt=""
              width={32}
              height={32}
              className="size-8"
            />
          </button>
        </div>

        <div className="mt-3.5 flex h-[29px] items-end justify-between">
          <p className="m-0 font-heading text-[24px] leading-[1.2] font-normal text-black/70">
            {t.cartDrawer.product}
          </p>
          <p className="m-0 font-heading text-[24px] leading-[1.2] font-normal text-black/70">
            {t.cartDrawer.total}
          </p>
        </div>

        <div className="mt-3.5 h-px w-full bg-black/40" />

        {cartItems.length === 0 ? (
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-8 text-center">
            <p className="m-0 font-heading text-[20px] leading-[1.2] font-medium text-black">
              {t.cartDrawer.emptyTitle}
            </p>
            <p className="m-0 mt-2 max-w-[280px] font-sans text-[16px] leading-[1.4] text-black/60">
              {t.cartDrawer.emptyText}
            </p>
          </div>
        ) : (
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pt-3.5">
            <ul className="m-0 flex list-none flex-col gap-6 p-0">
              {cartItems.map((item) => (
                <li key={`${item.productId}-${item.variantId}`} className="flex gap-5">
                  <div className="flex h-[188px] w-[145px] shrink-0 items-center justify-center bg-white-fa p-2.5">
                    {item.imageSrc ? (
                      <Image
                        src={item.imageSrc}
                        alt={item.imageAlt || item.title}
                        width={146}
                        height={188}
                        className="h-full w-full object-contain"
                      />
                    ) : null}
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div>
                      <p className="m-0 font-sans text-[16px] leading-[1.2] font-bold text-black">
                        {item.brand}
                      </p>
                      <div className="mt-3 flex items-start justify-between gap-3">
                        <p className="m-0 font-heading text-[16px] leading-[1.2] font-normal text-black">
                          {item.title}
                        </p>
                        <p className="m-0 shrink-0 font-heading text-[24px] leading-[1.2] font-light text-black">
                          {formatCartPrice(item.price * item.quantity, item.currency)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="flex h-11 w-[110px] items-center justify-between rounded-[10px] border border-black/40 px-2.5">
                        <button
                          type="button"
                          aria-label={t.cartDrawer.decrease}
                          className="inline-flex size-6 items-center justify-center border-none bg-transparent p-0 disabled:opacity-40"
                          disabled={item.quantity <= 1}
                          onClick={() => changeQuantity(item, item.quantity - 1)}
                        >
                          <Image
                            src="/images/catalog/minus-icon.svg"
                            alt=""
                            width={24}
                            height={24}
                          />
                        </button>
                        <span className="font-sans text-[20px] leading-[1.2] font-normal text-black">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label={t.cartDrawer.increase}
                          className="inline-flex size-6 items-center justify-center border-none bg-transparent p-0"
                          onClick={() => changeQuantity(item, item.quantity + 1)}
                        >
                          <Image
                            src="/images/catalog/plus-icon.svg"
                            alt=""
                            width={24}
                            height={24}
                          />
                        </button>
                      </div>

                      <button
                        type="button"
                        aria-label={t.cartDrawer.remove}
                        className="inline-flex size-6 items-center justify-center border-none bg-transparent p-0"
                        onClick={() =>
                          dispatch(
                            removeFromCart({
                              productId: item.productId,
                              variantId: item.variantId,
                            }),
                          )
                        }
                      >
                        <Image
                          src="/images/catalog/basket-icon.svg"
                          alt=""
                          width={24}
                          height={24}
                        />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {cartItems.length === 0 ? (
          <button
            type="button"
            className="inline-flex h-14 w-full items-center justify-center rounded-lg bg-dark px-5 font-heading text-[16px] leading-none font-normal text-white"
            onClick={closeCart}
          >
            {t.cartDrawer.startShopping}
          </button>
        ) : (
          <div className="mt-auto flex flex-col gap-[50px] pt-4">
          <div>
            <div className="h-px w-full bg-black/40" />
            <div className="mt-4 flex items-start justify-between gap-6">
              <div className="flex max-w-[242px] flex-col gap-3">
                <p className="m-0 font-heading text-[20px] leading-[1.2] font-normal text-black">
                  {t.cartDrawer.estimatedTotal}
                </p>
                <p className="m-0 font-sans text-[16px] leading-[1.2] font-normal text-black/60">
                  {t.cartDrawer.shippingNote}
                </p>
              </div>
              <p className="m-0 font-heading text-[20px] leading-[1.2] font-light text-black">
                {formatCartPrice(estimatedTotal, currency)}
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={cartItems.length === 0}
            className="inline-flex h-14 w-full items-center justify-center rounded-lg bg-dark px-5 font-heading text-[16px] leading-none font-normal text-white disabled:opacity-40"
            onClick={() => {
              closeCart();
              router.push('/checkout');
            }}
          >
            {t.cartDrawer.checkout}
          </button>
          </div>
        )}
      </aside>
    </>
  );
}
