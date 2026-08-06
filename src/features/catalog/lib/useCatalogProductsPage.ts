'use client';

import { useCallback, useMemo, useState } from 'react';

import { CATALOG_PAGE_SIZE } from '@/features/catalog/config/catalogPagination';
import type { CatalogCategory } from '@/features/catalog/model/catalogCategory';
import type { CatalogFilters } from '@/features/catalog/lib/catalogProductsData';
import { useCatalogProducts } from '@/features/catalog/lib/useCatalogProducts';

export function useCatalogProductsPage(category: CatalogCategory, filters: CatalogFilters = {}) {
  const products = useCatalogProducts(category, filters);
  const [pagination, setPagination] = useState({
    category,
    subcategory: filters.subcategory ?? '',
    type: filters.type ?? '',
    visibleCount: CATALOG_PAGE_SIZE,
  });

  if (
    pagination.category !== category ||
    pagination.subcategory !== (filters.subcategory ?? '') ||
    pagination.type !== (filters.type ?? '')
  ) {
    setPagination({
      category,
      subcategory: filters.subcategory ?? '',
      type: filters.type ?? '',
      visibleCount: CATALOG_PAGE_SIZE,
    });
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
