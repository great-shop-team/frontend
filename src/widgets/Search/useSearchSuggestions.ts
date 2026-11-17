'use client';

import { useMemo } from 'react';

import { buildProductHref } from '@/features/catalog/lib/buildProductHref';
import { unwrapList } from '@/store/api/unwrapList';
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

function matchScore(text: string, needle: string) {
  const value = text.trim().toLowerCase();
  if (!value) return 0;
  if (value === needle) return 100;
  if (value.startsWith(needle)) return 80;
  if (value.split(/[\s-/]+/).some((word) => word.startsWith(needle))) return 60;
  if (value.includes(needle)) return 40;
  return 0;
}

export function useSearchSuggestions(query: string, enabled: boolean) {
  const productsQuery = useGetProductsRawQuery(undefined, { skip: !enabled });
  const brandsQuery = useGetBrandsQuery(undefined, { skip: !enabled });

  const catalog = useMemo(() => {
    const apiProducts = unwrapList<ApiProduct>(productsQuery.data).filter((product) => {
      const active = product.is_active !== false;
      const hidden = product.is_hidden === true;
      return active && !hidden;
    });

    const brandById = new Map<number, Brand>(
      unwrapList<Brand>(brandsQuery.data).map((brand) => [brand.id, brand]),
    );

    return apiProducts.map((product) => ({
      id: String(product.id),
      title: product.name,
      brandName: brandById.get(product.brand)?.name,
      href: buildProductHref('women', product),
    }));
  }, [productsQuery.data, brandsQuery.data]);

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
