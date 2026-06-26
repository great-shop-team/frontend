'use client';

import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';
import type { CatalogProduct } from '@/features/catalog/model/catalogProduct';
import { catalogProductCard } from '@/features/catalog/ui/catalogClasses';
import { useTranslation } from '@/i18n/useTranslation';

type CatalogProductCardProps = {
  product: CatalogProduct;
  onAddToCart?: (selectedSize?: string) => void;
  onAddToWishlist?: () => void;
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
  if (normalizedCategory === 'perfumes' || product.id.startsWith('a-frag')) {
    return `/catalog/fragrances/${product.id}`;
  }
  if (normalizedCategory === 'unisex' || product.id.startsWith('u-')) {
    return `/catalog/unisex/${product.id}`;
  }
  if (
    normalizedCategory === 'accessories' ||
    normalizedSubcategory === 'accessories' ||
    normalizedSubcategory === 'bags' ||
    product.id.startsWith('a-acc')
  ) {
    return `/catalog/accessories/${product.id}`;
  }
  if (normalizedCategory === 'women' || product.id.startsWith('w-')) {
    return `/catalog/women/${product.id}`;
  }

  return `/catalog/men/${product.id}`;
};

export default function CatalogProductCard({
  product,
  onAddToCart,
  onAddToWishlist,
}: CatalogProductCardProps) {
  const { t } = useTranslation();

  const cardHref = getProductCategoryPath(product);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] ?? '');

  const isFragrance = product.subcategory === 'fragrances';
  const hasSizes = Array.isArray(product.sizes) && product.sizes.length > 0;
  const canAddToCart = product.inStock !== false;

  return (
    <article className={catalogProductCard.root}>
      <div className={catalogProductCard.imageArea}>
        <Link href={cardHref} className="relative flex h-full w-full items-center justify-center">
          <Image
            src={product.image.src}
            alt={product.image.alt}
            fill
            sizes="280px"
            className="object-contain mix-blend-multiply"
          />
        </Link>

        <button
          type="button"
          className="absolute top-4 right-4 cursor-pointer border-none bg-transparent p-1 text-dark transition-transform hover:scale-110"
          onClick={onAddToWishlist}
          aria-label={t.landing.addToWishlist}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.2}
            stroke="currentColor"
            className="size-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
        </button>

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

      <div className={catalogProductCard.body}>
        <div className={catalogProductCard.meta}>
          <div className="min-w-0 flex-1">
            <Link href={cardHref} className="hover:underline">
              <h4 className={catalogProductCard.title}>{product.title}</h4>
            </Link>
          </div>
          <span className="shrink-0 font-medium whitespace-nowrap">{product.price}</span>
        </div>

        {hasSizes ? (
          <div className={catalogProductCard.sizes} role="group" aria-label={t.catalog.addToCart}>
            {product.sizes!.map((size) => {
              const isSelected = selectedSize === size;
              return (
                <button
                  key={size}
                  type="button"
                  className={`cursor-pointer rounded-[10px] border px-4 py-3 text-sm transition-all duration-200 ${
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
        ) : (
          <div className={catalogProductCard.sizes} aria-hidden="true" />
        )}

        <p className={catalogProductCard.stockStatus} aria-live="polite">
          {!canAddToCart ? t.catalog.outOfStock : '\u00a0'}
        </p>

        <div className={catalogProductCard.footer}>
          <div className={catalogProductCard.actions}>
            {!isFragrance ? (
              <Link href={cardHref} className="bit-primary-thin inline-block">
                {t.catalog.moreColours}
              </Link>
            ) : (
              <span className={catalogProductCard.moreColoursSpacer} aria-hidden="true" />
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
