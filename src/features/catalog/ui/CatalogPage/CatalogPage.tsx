'use client';

import type { CatalogCategory } from '@/features/catalog/model/catalogCategory';
import type { CatalogFilters } from '@/features/catalog/lib/catalogProductsData';
import { useCatalogProductsPage } from '@/features/catalog/lib/useCatalogProductsPage';
import CatalogBanner from '@/features/catalog/ui/CatalogBanner/CatalogBanner';
import CatalogLoadMore from '@/features/catalog/ui/CatalogLoadMore/CatalogLoadMore';
import CatalogProductGrid from '@/features/catalog/ui/CatalogProductGrid/CatalogProductGrid';
import CatalogToolbar from '@/features/catalog/ui/CatalogToolbar/CatalogToolbar';
import { catalogPage } from '@/features/catalog/ui/catalogClasses';

type CatalogPageProps = {
  category: CatalogCategory;
  filters?: CatalogFilters;
};

export default function CatalogPage({ category, filters = {} }: CatalogPageProps) {
  const { products, total, viewed, hasMore, loadMore } = useCatalogProductsPage(category, filters);

  return (
    <div className="mb-20">
      <CatalogBanner category={category} />

      <div id="catalog-products" className={catalogPage.content}>
        <CatalogToolbar stylesCount={total} />

        <CatalogProductGrid products={products} />

        {total > 0 ? (
          <CatalogLoadMore viewed={viewed} total={total} onClick={hasMore ? loadMore : undefined} />
        ) : null}
      </div>
    </div>
  );
}
