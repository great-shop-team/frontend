'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useTranslation } from '@/i18n/useTranslation';

type FeaturedProductCardProps = {
  href: string;
  image: { src: string; alt: string };
  title: string;
  price: string;
  imageFit?: 'contain' | 'cover';
};

export default function FeaturedProductCard({
  href,
  image,
  title,
  price,
  imageFit = 'contain',
}: FeaturedProductCardProps) {
  const { t } = useTranslation();

  return (
    <article className="flex h-full min-h-[320px] w-full flex-col bg-[#fafafa] p-6 md:min-h-[480px] md:p-8">
      <div className="relative mb-6 flex flex-1 items-center justify-center">
        <Link href={href} className="relative block h-full min-h-[200px] w-full max-w-[280px]">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="280px"
            className={imageFit === 'contain' ? 'object-contain' : 'object-cover'}
          />
        </Link>
        <Link
          href={href}
          className="absolute right-0 bottom-0 flex size-10 items-center justify-center rounded-full border-none bg-black text-white no-underline transition-transform duration-200 hover:scale-105 md:right-2 md:bottom-2"
          aria-label={t.landing.addToCart}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-5"
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </Link>
      </div>
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <Link href={href} className="no-underline hover:underline">
            <h3 className="m-0 mb-1 font-(family-name:--font-unbounded) text-base font-normal text-dark">
              {title}
            </h3>
          </Link>
          <p className="m-0 font-(family-name:--font-pt-sans-caption) text-base font-medium text-dark">
            {price}
          </p>
        </div>
        <Link
          href={href}
          className="shrink-0 font-(family-name:--font-pt-sans-caption) text-sm font-normal text-dark underline underline-offset-4"
        >
          {t.landing.shopNow}
        </Link>
      </div>
    </article>
  );
}
