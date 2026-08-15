'use client';

import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';
import WishlistButton from '@/features/wishlist/ui/WishlistButton/WishlistButton';
import type { CatalogProduct } from '@/features/catalog/model/catalogProduct';
import { catalogProductCard } from '@/features/catalog/ui/catalogClasses';
import { useTranslation } from '@/i18n/useTranslation';

type CatalogProductCardProps = {
  product: CatalogProduct;
  onAddToCart?: (selectedSize?: string) => void;
};

const getProductCategoryPath = (product: CatalogProduct): string => {
  if (product.href) return product.href;

  let categoryName = '';

  if (typeof product.category === 'string') {
    categoryName = product.category;
  } else if (product.category && typeof product.category === 'object') {
    const categoryObj = product.category as unknown as { id?: string; name?: string };
    categoryName = categoryObj.id || categoryObj.name || '';
  }

  const normalizedCategory = categoryName.toLowerCase();
  const normalizedSubcategory = (product.subcategory || '').toLowerCase();

  if (normalizedSubcategory === 'fragrances' || normalizedCategory === 'fragrances') {
    return `/catalog/fragrances/${product.id}`;
  }
  if (normalizedCategory === 'accessories' || normalizedSubcategory === 'accessories') {
    return `/catalog/accessories/${product.id}`;
  }
  if (normalizedCategory === 'women' || product.id.startsWith('w-')) {
    return `/catalog/women/${product.id}`;
  }

  return `/catalog/men/${product.id}`;
};

export default function CatalogProductCard({ product, onAddToCart }: CatalogProductCardProps) {
  const { t } = useTranslation();

  const cardHref = getProductCategoryPath(product);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] ?? '');

  const isFragrance = product.subcategory === 'fragrances';
  const hasSizes = Array.isArray(product.sizes) && product.sizes.length > 0;
  const canAddToCart = product.inStock !== false;

  return (
    <article className={catalogProductCard.root}>
      <div className="relative mb-3 flex aspect-413/493 w-full items-center justify-center bg-[#FAFAFA] md:mb-4">
        <Link href={cardHref} className="relative flex h-full w-full items-center justify-center">
          <Image
            src={product.image.src}
            alt={product.image.alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain mix-blend-multiply"
          />
        </Link>

        <WishlistButton
          productId={product.id}
          className="absolute top-2 right-2 flex min-h-11 min-w-11 cursor-pointer items-center justify-center border-none bg-transparent p-1 text-dark transition-transform hover:scale-110 md:top-4 md:right-4"
        />

        <button
          type="button"
          className={catalogProductCard.addToCartBtn}
          onClick={() => canAddToCart && onAddToCart?.(selectedSize)}
          disabled={!canAddToCart}
          aria-disabled={!canAddToCart}
          aria-label={canAddToCart ? t.landing.addToCart : t.catalog.outOfStock}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      </div>

      <div className={catalogProductCard.meta}>
        <div className="min-w-0 flex flex-col gap-1">
          <Link href={cardHref} className="hover:underline">
            <h4 className="m-0 text-sm leading-snug break-words md:text-base">{product.title}</h4>
          </Link>
        </div>
        <span className="shrink-0 text-sm font-medium whitespace-nowrap md:text-base">
          {product.price}
        </span>
      </div>

      {hasSizes && (
        <div className="mt-2 flex flex-wrap gap-1.5 md:mt-3 md:gap-2" role="group" aria-label={t.catalog.addToCart}>
          {product.sizes!.map((size) => {
            const isSelected = selectedSize === size;
            return (
              <button
                key={size}
                type="button"
                className={`min-h-9 cursor-pointer rounded-[8px] border px-2.5 py-1.5 text-xs transition-all duration-200 md:rounded-[10px] md:px-4 md:py-3 md:text-sm ${
                  isSelected
                    ? 'border-black bg-black text-white'
                    : 'border-neutral-300 bg-transparent text-neutral-800 hover:border-black'
                }`}
                onClick={() => setSelectedSize(size)}
                aria-pressed={isSelected}
                disabled={!canAddToCart}
              >
                {size}
              </button>
            );
          })}
        </div>
      )}

      {!isFragrance ? (
        <Link href={cardHref} className="bit-primary-thin mt-3 inline-block">
          {t.catalog.moreColours}
        </Link>
      ) : null}

      <p className={catalogProductCard.stockStatus} aria-live="polite">
        {!canAddToCart ? t.catalog.outOfStock : '\u00a0'}
      </p>
    </article>
  );
}
