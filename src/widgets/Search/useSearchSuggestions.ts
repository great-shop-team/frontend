'use client';

import { useMemo } from 'react';

import { getCatalogProducts } from '@/features/catalog/lib/catalogProductsData';
import { CATALOG_CATEGORY_SLUGS } from '@/features/catalog/model/catalogCategory';
import type { Locale } from '@/i18n/config';
import { useGetBrandsQuery } from '@/store/endpoints/brandsEndpoints';
import { useGetProductsRawQuery } from '@/store/endpoints/productsEndpoints';
import type { ApiProduct, Brand } from '@/store/types';

export type SearchHit = {
  id: string;
  title: string;
  brandName?: string;
  href: string;
  score: number;
};

const MAX_HITS = 8;

function toArray<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === 'object' && Array.isArray((data as { results?: unknown }).results)) {
    return (data as { results: T[] }).results;
  }
  return [];
}

function matchScore(text: string, needle: string) {
  const value = text.trim().toLowerCase();
  if (!value) return 0;
  if (value === needle) return 100;
  if (value.startsWith(needle)) return 80;
  if (value.split(/[\s-/]+/).some((word) => word.startsWith(needle))) return 60;
  if (value.includes(needle)) return 40;
  return 0;
}

function getMockHits(locale: Locale): Omit<SearchHit, 'score'>[] {
  return CATALOG_CATEGORY_SLUGS.flatMap((category) =>
    getCatalogProducts(category, locale).map((product) => ({
      id: product.id,
      title: product.title,
      brandName: product.brandName,
      href: product.href,
    })),
  );
}

export function useSearchSuggestions(query: string, locale: Locale, enabled: boolean) {
  const productsQuery = useGetProductsRawQuery(undefined, { skip: !enabled });
  const brandsQuery = useGetBrandsQuery(undefined, { skip: !enabled });

  const catalog = useMemo(() => {
    const apiProducts = toArray<ApiProduct>(productsQuery.data).filter((product) => {
      const active = product.is_active !== false;
      const hidden = product.is_hidden === true;
      return active && !hidden;
    });

    const brandById = new Map<number, Brand>(
      toArray<Brand>(brandsQuery.data).map((brand) => [brand.id, brand]),
    );

    if (apiProducts.length > 0) {
      return apiProducts.map((product) => ({
        id: String(product.id),
        title: product.name,
        brandName: brandById.get(product.brand)?.name,
        href: `/catalog/women/${product.id}`,
      }));
    }

    return getMockHits(locale);
  }, [productsQuery.data, brandsQuery.data, locale]);

  const hits = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return [];

    return catalog
      .map((item) => {
        const score = Math.max(
          matchScore(item.title, needle),
          matchScore(item.brandName ?? '', needle),
        );
        return { ...item, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
      .slice(0, MAX_HITS);
  }, [catalog, query]);

  return {
    hits,
    isLoading: enabled && productsQuery.isLoading,
  };
}
