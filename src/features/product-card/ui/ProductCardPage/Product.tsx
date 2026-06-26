'use client';

import { useMemo } from 'react';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import CatalogProductCard from '@/features/catalog/ui/CatalogProductCard/CatalogProductCard';
import { getCatalogProductById } from '@/entities/product/lib/catalogProducts';
import { mapProductToCatalogCard } from '@/entities/product/lib/mapProductToCatalogCard';
import ProductShowcase from '@/widgets/ProductShowcase/ProductShowcase';
import { useTranslation } from '@/i18n/useTranslation';
import { useGetProductCardQuery } from '@/store/endpoints/productsEndpoints';
import { useParams } from 'next/navigation';

export default function Product() {
  const { t, locale } = useTranslation();
  const params = useParams();
  const id = params.id as string;
  const { data: productCard, isLoading, isError, error } = useGetProductCardQuery(id);

  const relatedProducts = useMemo(() => {
    if (!productCard?.botonImages?.length) {
      return [];
    }

    return productCard.botonImages
      .map((item) => getCatalogProductById(item.id))
      .filter((product) => product !== null)
      .map((product) => mapProductToCatalogCard(product, locale));
  }, [productCard, locale]);

  if (isLoading) {
    return <div>{t.common.loading}</div>;
  }

  if (isError || !productCard) {
    const queryError = error as FetchBaseQueryError | undefined;
    const errorStatus =
      queryError && 'originalStatus' in queryError
        ? queryError.originalStatus
        : queryError && 'status' in queryError
          ? queryError.status
          : null;
    const errorMessage =
      errorStatus === 404
        ? t.common.error
        : errorStatus
          ? `${t.common.error}: ${String(errorStatus)}`
          : t.common.error;

    return <div>{errorMessage}</div>;
  }

  return (
    <div>
      <ProductShowcase
        brand={productCard.brand}
        title={productCard.title}
        description={productCard.description}
        price={productCard.price}
        code={productCard.code}
        size={productCard.size}
        rating={productCard.rating}
        images={productCard.images}
        link={productCard.link}
      />

      {relatedProducts.length > 0 ? (
        <div className="m-[2%]">
          <h2 className="m-[2%] text-[36px] font-normal">{t.product.youMayAlsoLike}</h2>

          <div className="relative flex gap-[2%]">
            {relatedProducts.map((product) => (
              <CatalogProductCard
                key={product.id}
                product={product}
                onAddToCart={(size) => console.log('Add to cart:', product.id, size)}
                onAddToWishlist={() => console.log('Add to wishlist:', product.id)}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
