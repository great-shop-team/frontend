'use client';

import Image from 'next/image';
import Link from 'next/link';

import WishlistButton from '@/features/wishlist/ui/WishlistButton/WishlistButton';
import { useTranslation } from '@/i18n/useTranslation';

type LandingProductCardProps = {
  id: string;
  href: string;
  image: { src: string; alt: string };
  title: string;
  price: string;
  imageClassName?: string;
};

export default function LandingProductCard({
  id,
  href,
  image,
  title,
  price,
  imageClassName = 'object-cover object-top',
}: LandingProductCardProps) {
  const { t } = useTranslation();

  return (
    <article className="group flex w-full flex-col gap-[19px]">
      <div className="relative flex aspect-413/493 w-full items-center justify-center overflow-hidden bg-[#fafafa]">
        <Link href={href} className="relative aspect-258/387 h-[78%] shrink-0 overflow-hidden">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="258px"
            className={`transition-transform duration-500 ease-out group-hover:scale-[1.03] ${imageClassName}`}
          />
        </Link>

        <div className="absolute top-4 right-4 z-1">
          <WishlistButton
            productId={id}
            className="flex cursor-pointer items-center justify-center border-none bg-transparent p-0 text-dark transition-transform hover:scale-110"
            iconClassName="size-5"
          />
        </div>

        <Link
          href={href}
          className="absolute right-4 bottom-4 z-1 flex size-[60px] items-center justify-center rounded-full border-none bg-black text-white no-underline transition-transform duration-200 hover:scale-105"
          aria-label={t.landing.addToCart}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </Link>
      </div>

      <div className="flex flex-col gap-[19px]">
        <div className="flex items-start justify-between gap-3">
          <Link href={href} className="min-w-0 no-underline hover:underline">
            <h3 className="m-0 font-(family-name:--font-unbounded) text-base font-medium text-dark">
              {title}
            </h3>
          </Link>
          <span className="shrink-0 font-(family-name:--font-unbounded) text-base font-light text-dark">
            {price}
          </span>
        </div>
        <Link
          href={href}
          className="inline-flex h-10 w-fit items-center justify-center rounded-[8px] border border-black bg-transparent px-4 font-(family-name:--font-unbounded) text-sm font-normal text-dark no-underline transition-colors hover:bg-black hover:text-white"
        >
          {t.landing.showMore}
        </Link>
      </div>
    </article>
  );
}
