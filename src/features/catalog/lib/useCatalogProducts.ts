'use client';

import { useMemo } from 'react';

import type { CatalogCategory } from '@/features/catalog/model/catalogCategory';
import { useTranslation } from '@/i18n/useTranslation';
import {
  getCatalogProducts,
  getCatalogProductsCount,
  getProductById,
  getProductBySlug,
} from './catalogProductsData';

export function useCatalogProducts(category: CatalogCategory) {
  const { locale } = useTranslation();

  return useMemo(() => getCatalogProducts(category, locale), [category, locale]);
}
