'use client';

import type { CatalogProduct } from '@/features/catalog/model/catalogProduct';
import CatalogProductCard from '@/features/catalog/ui/CatalogProductCard/CatalogProductCard';
import { catalogGrid } from '@/features/catalog/ui/catalogClasses';

type CatalogProductGridProps = {
  products: CatalogProduct[];
};

export default function CatalogProductGrid({ products }: CatalogProductGridProps) {
  return (
    <div className={catalogGrid.root}>
      {products.map((product) => (
        <CatalogProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
