'use client';

import { useCallback, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import type { CatalogScope } from '@/features/catalog/model/catalogCategory';
import { isFragranceSubcategory } from '@/features/catalog/model/catalogCategory';
import {
  CATALOG_GENDER_FILTERS,
  CATALOG_GROUP_FILTERS,
  isCatalogSortOption,
  parseCsvParam,
  parseGenderParams,
  parseGroupParams,
  toPartialCsvParam,
  type CatalogListingFilters,
} from '@/features/catalog/model/catalogFilters';
import { useCatalogListing } from '@/features/catalog/lib/useCatalogListing';
import { CATALOG_PAGE_SIZE } from '@/features/catalog/config/catalogPagination';
import CatalogBanner from '@/features/catalog/ui/CatalogBanner/CatalogBanner';
import CatalogBreadcrumbs from '@/features/catalog/ui/CatalogBreadcrumbs/CatalogBreadcrumbs';
import CatalogFilterPanel from '@/features/catalog/ui/CatalogFilter/CatalogFilterPanel';
import CatalogLoadMore from '@/features/catalog/ui/CatalogLoadMore/CatalogLoadMore';
import CatalogProductGrid from '@/features/catalog/ui/CatalogProductGrid/CatalogProductGrid';
import CatalogToolbar from '@/features/catalog/ui/CatalogToolbar/CatalogToolbar';
import { catalogPage } from '@/features/catalog/ui/catalogClasses';
import { useTranslation } from '@/i18n/useTranslation';

type CatalogPageProps = {
  category: CatalogScope;
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
      q: searchParams.get('q')?.trim() || undefined,
      subcategory: parseCsvParam(searchParams.get('subcategory')),
      type: searchParams.get('type') ?? undefined,
      gender: parseGenderParams(searchParams.get('gender')),
      group: parseGroupParams(searchParams.get('group')),
      brand: parseCsvParam(searchParams.get('brand')),
      color: parseCsvParam(searchParams.get('color')),
      size: parseCsvParam(searchParams.get('size')),
      sort: isCatalogSortOption(sortParam) ? sortParam : 'featured',
    };
  }, [searchParams]);

  const { products, facets, isLoading, isError } = useCatalogListing(category, filters);

  const filterKey = [
    category,
    filters.q,
    (filters.subcategory ?? []).join(','),
    filters.type,
    (filters.gender ?? []).join(','),
    (filters.group ?? []).join(','),
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

  const isPartial = (selected: string[] | undefined, total: number) => {
    const count = selected?.length ?? 0;
    return count > 0 && count < total;
  };

  const activeFilterCount =
    Number(isPartial(filters.brand, facets.brands.length)) +
    Number(isPartial(filters.color, facets.colors.length)) +
    Number(isPartial(filters.size, facets.sizes.length)) +
    Number(isPartial(filters.subcategory, facets.subcategories.length)) +
    Number(isPartial(filters.gender, CATALOG_GENDER_FILTERS.length)) +
    Number(isPartial(filters.group, CATALOG_GROUP_FILTERS.length));

  const bannerCategory: CatalogScope =
    category === 'fragrances' || (filters.subcategory ?? []).some((item) => isFragranceSubcategory(item))
      ? 'fragrances'
      : category;

  const breadcrumbs = useMemo(() => {
    const home = { href: '/', label: t.common.home };
    const all = { label: t.catalog.breadcrumbAll, current: true };

    if (bannerCategory === 'all') {
      return [home, { href: '/catalog', label: t.catalog.title }, all];
    }

    const categoryLabel = t.catalog.categories[bannerCategory].navLabel;
    const categoryHref = `/catalog/${bannerCategory}`;
    const selectedSubcategories = filters.subcategory ?? [];
    const subcategory =
      selectedSubcategories.length === 1
        ? facets.subcategories.find(
            (item) =>
              item.slug === selectedSubcategories[0] || String(item.id) === selectedSubcategories[0],
          )
        : undefined;

    if (subcategory) {
      return [
        home,
        { href: categoryHref, label: categoryLabel },
        { label: subcategory.name, current: true },
      ];
    }

    return [home, { href: categoryHref, label: categoryLabel }, all];
  }, [
    bannerCategory,
    facets.subcategories,
    filters.subcategory,
    t.catalog.breadcrumbAll,
    t.catalog.categories,
    t.catalog.title,
    t.common.home,
  ]);

  return (
    <div className="mb-12 md:mb-20">
      <CatalogBanner category={bannerCategory} />

      <div className={catalogPage.breadcrumbs}>
        <CatalogBreadcrumbs items={breadcrumbs} />
      </div>

      <div id="catalog-products" className={catalogPage.content}>
        <CatalogToolbar
          stylesCount={products.length}
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
        selectedSubcategories={filters.subcategory ?? []}
        selectedGenders={filters.gender ?? []}
        selectedGroups={filters.group ?? []}
        sort={filters.sort ?? 'featured'}
        onApply={(next) => {
          const brandIds = facets.brands.map((item) => String(item.id));
          const colorIds = facets.colors.map((item) => String(item.id));
          const sizeIds = facets.sizes.map((item) => String(item.id));
          const subcategoryIds = facets.subcategories.map((item) => item.slug || String(item.id));
          updateParams({
            sort: next.sort === 'featured' ? undefined : next.sort,
            gender: toPartialCsvParam(next.gender, CATALOG_GENDER_FILTERS),
            subcategory: toPartialCsvParam(next.subcategory, subcategoryIds),
            group: toPartialCsvParam(next.group, CATALOG_GROUP_FILTERS),
            size: toPartialCsvParam(next.size, sizeIds),
            color: toPartialCsvParam(next.color, colorIds),
            brand: toPartialCsvParam(next.brand, brandIds),
          });
        }}
      />
    </div>
  );
}
