'use client';

import type { CatalogCollectionSlug } from '@/features/catalog/model/catalogCollection';
import { useCatalogCollectionProductsPage } from '@/features/catalog/lib/useCatalogCollectionProductsPage';
import CatalogCollectionBanner from '@/features/catalog/ui/CatalogCollectionBanner/CatalogCollectionBanner';
import CatalogLoadMore from '@/features/catalog/ui/CatalogLoadMore/CatalogLoadMore';
import CatalogProductGrid from '@/features/catalog/ui/CatalogProductGrid/CatalogProductGrid';
import CatalogToolbar from '@/features/catalog/ui/CatalogToolbar/CatalogToolbar';
import { catalogPage } from '@/features/catalog/ui/catalogClasses';

type CatalogCollectionPageProps = {
  collection: CatalogCollectionSlug;
};

export default function CatalogCollectionPage({ collection }: CatalogCollectionPageProps) {
  const { products, total, viewed, hasMore, loadMore } =
    useCatalogCollectionProductsPage(collection);

  return (
    <div className="mb-20">
      <CatalogCollectionBanner collection={collection} />

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
