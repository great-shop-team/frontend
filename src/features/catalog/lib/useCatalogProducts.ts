'use client';

import { useMemo } from 'react';

import {
  mapProductToCatalogCard,
  productMatchesCatalogCategory,
  productMatchesCatalogCollection,
} from '@/entities/product';
import { catalogProducts, getCatalogProductById } from '@/entities/product/lib/catalogProducts';
import type { CatalogCategory } from '@/features/catalog/model/catalogCategory';
import type { CatalogCollectionSlug } from '@/features/catalog/model/catalogCollection';
import { getCollectionTag } from '@/features/catalog/model/catalogCollection';
import { useTranslation } from '@/i18n/useTranslation';

const allProducts = catalogProducts;

export { getCatalogProductById as getProductById };

export function useCatalogProducts(category: CatalogCategory) {
  const { locale } = useTranslation();

  return useMemo(
    () =>
      allProducts
        .filter((product) => productMatchesCatalogCategory(product, category))
        .map((product) => mapProductToCatalogCard(product, locale)),
    [category, locale],
  );
}

export function getCatalogProductsCount(category: CatalogCategory) {
  return allProducts.filter((product) => productMatchesCatalogCategory(product, category)).length;
}

export function getProductBySlug(slug: string) {
  return allProducts.find((product) => product.slug === slug) ?? null;
}

export function useCatalogCollectionProducts(collection: CatalogCollectionSlug) {
  const { locale } = useTranslation();
  const tag = getCollectionTag(collection);

  return useMemo(
    () =>
      allProducts
        .filter((product) => productMatchesCatalogCollection(product, tag))
        .map((product) => mapProductToCatalogCard(product, locale)),
    [locale, tag],
  );
}

export function getCatalogCollectionProductsCount(collection: CatalogCollectionSlug) {
  const tag = getCollectionTag(collection);
  return allProducts.filter((product) => productMatchesCatalogCollection(product, tag)).length;
}
