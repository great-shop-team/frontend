'use client';

import { useCallback, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import type { CatalogCategory } from '@/features/catalog/model/catalogCategory';
import {
  isCatalogSortOption,
  parseCsvParam,
  toCsvParam,
  type CatalogListingFilters,
  type CatalogSortOption,
} from '@/features/catalog/model/catalogFilters';
import { useCatalogListing } from '@/features/catalog/lib/useCatalogListing';
import { CATALOG_PAGE_SIZE } from '@/features/catalog/config/catalogPagination';
import CatalogBanner from '@/features/catalog/ui/CatalogBanner/CatalogBanner';
import CatalogFilterPanel from '@/features/catalog/ui/CatalogFilter/CatalogFilterPanel';
import CatalogLoadMore from '@/features/catalog/ui/CatalogLoadMore/CatalogLoadMore';
import CatalogProductGrid from '@/features/catalog/ui/CatalogProductGrid/CatalogProductGrid';
import CatalogToolbar from '@/features/catalog/ui/CatalogToolbar/CatalogToolbar';
import { catalogPage } from '@/features/catalog/ui/catalogClasses';
import { useTranslation } from '@/i18n/useTranslation';

type CatalogPageProps = {
  category: CatalogCategory;
};

export default function CatalogPage({ category }: CatalogPageProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(CATALOG_PAGE_SIZE);

  const filters = useMemo<CatalogListingFilters>(() => {
    const sortParam = searchParams.get('sort');
    return {
      subcategory: searchParams.get('subcategory') ?? undefined,
      type: searchParams.get('type') ?? undefined,
      brand: parseCsvParam(searchParams.get('brand')),
      color: parseCsvParam(searchParams.get('color')),
      size: parseCsvParam(searchParams.get('size')),
      sort: isCatalogSortOption(sortParam) ? sortParam : 'featured',
    };
  }, [searchParams]);

  const { products, facets, isLoading, isError } = useCatalogListing(category, filters);

  const filterKey = [
    category,
    filters.subcategory,
    filters.type,
    (filters.brand ?? []).join(','),
    (filters.color ?? []).join(','),
    (filters.size ?? []).join(','),
    filters.sort,
  ].join('|');

  const [paginationKey, setPaginationKey] = useState(filterKey);
  if (paginationKey !== filterKey) {
    setPaginationKey(filterKey);
    setVisibleCount(CATALOG_PAGE_SIZE);
  }

  const visibleProducts = products.slice(0, visibleCount);
  const hasMore = visibleCount < products.length;

  const updateParams = useCallback(
    (patch: Record<string, string | undefined>) => {
      const next = new URLSearchParams(searchParams.toString());
      Object.entries(patch).forEach(([key, value]) => {
        if (!value) next.delete(key);
        else next.set(key, value);
      });
      const query = next.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const activeFilterCount =
    (filters.brand?.length ?? 0) +
    (filters.color?.length ?? 0) +
    (filters.size?.length ?? 0) +
    (filters.subcategory ? 1 : 0);

  return (
    <div className="mb-20">
      <CatalogBanner category={category} />

      <div id="catalog-products" className={catalogPage.content}>
        <CatalogToolbar
          stylesCount={products.length}
          sort={filters.sort}
          onSortChange={(sort: CatalogSortOption) =>
            updateParams({ sort: sort === 'featured' ? undefined : sort })
          }
          onFilterClick={() => setIsFilterOpen(true)}
          activeFilterCount={activeFilterCount}
        />

        {isLoading ? (
          <p className="py-16 text-center text-dark/60">{t.common.loading}</p>
        ) : isError && products.length === 0 ? (
          <p className="py-16 text-center text-dark/60">{t.catalog.loadError}</p>
        ) : products.length === 0 ? (
          <p className="py-16 text-center text-dark/60">{t.catalog.empty}</p>
        ) : (
          <>
            <CatalogProductGrid products={visibleProducts} />
            <CatalogLoadMore
              viewed={visibleProducts.length}
              total={products.length}
              onClick={
                hasMore
                  ? () =>
                      setVisibleCount((count) =>
                        Math.min(count + CATALOG_PAGE_SIZE, products.length),
                      )
                  : undefined
              }
            />
          </>
        )}
      </div>

      <CatalogFilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        brands={facets.brands}
        subcategories={facets.subcategories}
        colors={facets.colors}
        sizes={facets.sizes}
        selectedBrands={filters.brand ?? []}
        selectedColors={filters.color ?? []}
        selectedSizes={filters.size ?? []}
        selectedSubcategory={filters.subcategory}
        onChange={(next) =>
          updateParams({
            brand: toCsvParam(next.brand),
            color: toCsvParam(next.color),
            size: toCsvParam(next.size),
            subcategory: next.subcategory,
          })
        }
      />
    </div>
  );
}
