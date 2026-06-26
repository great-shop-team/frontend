'use client';

import { useCallback, useMemo, useState } from 'react';

import { CATALOG_PAGE_SIZE } from '@/features/catalog/config/catalogPagination';
import type { CatalogCollectionSlug } from '@/features/catalog/model/catalogCollection';
import { useCatalogCollectionProducts } from '@/features/catalog/lib/useCatalogProducts';

export function useCatalogCollectionProductsPage(collection: CatalogCollectionSlug) {
  const products = useCatalogCollectionProducts(collection);
  const [pagination, setPagination] = useState({
    collection,
    visibleCount: CATALOG_PAGE_SIZE,
  });

  if (pagination.collection !== collection) {
    setPagination({ collection, visibleCount: CATALOG_PAGE_SIZE });
  }

  const { visibleCount } = pagination;

  const visibleProducts = useMemo(() => products.slice(0, visibleCount), [products, visibleCount]);

  const loadMore = useCallback(() => {
    setPagination((current) => ({
      ...current,
      visibleCount: Math.min(current.visibleCount + CATALOG_PAGE_SIZE, products.length),
    }));
  }, [products.length]);

  const hasMore = visibleCount < products.length;

  return {
    products: visibleProducts,
    total: products.length,
    viewed: visibleProducts.length,
    hasMore,
    loadMore,
  };
}
