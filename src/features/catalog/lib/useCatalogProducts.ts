'use client';

import { useMemo } from 'react';

import type { CatalogCategory } from '@/features/catalog/model/catalogCategory';
import type { CatalogFilters } from '@/features/catalog/lib/catalogProductsData';
import { useTranslation } from '@/i18n/useTranslation';
import {
  getCatalogProducts,
  getCatalogProductsCount,
  getProductById,
  getProductBySlug,
} from './catalogProductsData';

export function useCatalogProducts(category: CatalogCategory, filters: CatalogFilters = {}) {
  const { locale } = useTranslation();

  return useMemo(
    () => getCatalogProducts(category, locale, filters),
    [category, locale, filters.subcategory, filters.type],
  );
}
