'use client';

import Image from 'next/image';
import { useState } from 'react';

import WishlistButton from '@/features/wishlist/ui/WishlistButton/WishlistButton';
import { useTranslation } from '@/i18n/useTranslation';

type FragranceProductCardProps = {
  id: string;
  image: { src: string; alt: string };
  title: string;
  price: string;
  sizes: string[];
};

export default function FragranceProductCard({
  id,
  image,
  title,
  price,
  sizes,
}: FragranceProductCardProps) {
  const { t } = useTranslation();
  const [selectedSize, setSelectedSize] = useState(sizes[0] ?? '');

  return (
    <article className="flex w-full max-w-103.25 flex-col">
      {/* <div className="mb-4 flex aspect-413/493 w-full items-center justify-center bg-white shadow-[0_4px_24px_rgb(19_17_24/8%)]"> */}
      <div className="relative mb-4 flex aspect-413/493 w-full items-center justify-center bg-[#FAFAFA]">
        <div className="mx-auto flex h-[78.5%] w-fit items-stretch gap-2">
          <div className="relative aspect-258/387 h-full shrink-0 overflow-hidden">
            <Image src={image.src} alt={image.alt} fill sizes="258px" className="object-cover" />
          </div>
          <div className="flex shrink-0 flex-col items-center justify-between py-4">
            <WishlistButton productId={id} iconClassName="size-6" />
            <button
              type="button"
              className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full border-none bg-black text-white"
              aria-label={t.landing.addToCart}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className="mx-auto mb-3 flex w-full  items-start justify-between gap-3">
        <h3 className="m-0 min-w-0 font-(family-name:--font-poppins) text-base font-normal">
          {title}
        </h3>
        <span className="text-base font-medium whitespace-nowrap">{price}</span>
      </div>
      {sizes.length > 0 && (
        <div
          className="mx-auto flex w-full flex-wrap gap-2"
          role="group"
          aria-label={t.landing.selectSize}
        >
          {sizes.map((size) => (
            <button
              key={size}
              type="button"
              className={`cursor-pointer rounded-[10px] border px-3 py-1.5 text-sm font-light text-dark ${
                selectedSize === size
                  ? 'border-black bg-black text-white'
                  : 'border-gray bg-transparent'
              }`}
              onClick={() => setSelectedSize(size)}
              aria-pressed={selectedSize === size}
            >
              {size}
            </button>
          ))}
        </div>
      )}
    </article>
  );
}
