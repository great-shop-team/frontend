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

export default function CatalogProductCard({
  product,
  onAddToCart,
}: CatalogProductCardProps) {
  const { t } = useTranslation();

  const cardHref = getProductCategoryPath(product);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] ?? '');

  const isFragrance = product.subcategory === 'fragrances';
  const hasSizes = Array.isArray(product.sizes) && product.sizes.length > 0;
  const canAddToCart = product.inStock !== false;

  return (
    <article className={catalogProductCard.root}>
      <div className="relative mb-4 flex aspect-413/493 w-full items-center justify-center bg-[#FAFAFA]">
        <Link href={cardHref} className="relative flex h-full w-full items-center justify-center">
          <Image
            src={product.image.src}
            alt={product.image.alt}
            fill
            sizes="(max-width: 768px) 100vw, 258px"
            className="object-contain mix-blend-multiply"
          />
        </Link>

        <WishlistButton
          productId={product.id}
          className="absolute top-4 right-4 cursor-pointer border-none bg-transparent p-1 text-dark transition-transform hover:scale-110"
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
        <div className="flex flex-col gap-1">
          <Link href={cardHref} className="hover:underline">
            <h4>{product.title}</h4>
          </Link>
        </div>
        <span className="font-medium whitespace-nowrap">{product.price}</span>
      </div>

      {hasSizes && (
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label={t.catalog.addToCart}>
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
