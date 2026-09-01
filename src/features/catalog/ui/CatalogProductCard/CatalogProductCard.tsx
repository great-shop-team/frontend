'use client';

import LandingProductCard from '@/features/landing/ui/sections/LandingProductCard/LandingProductCard';
import type { CatalogProduct } from '@/features/catalog/model/catalogProduct';
import { useTranslation } from '@/i18n/useTranslation';

type CatalogProductCardProps = {
  product: CatalogProduct;
};

const getProductCategoryPath = (product: CatalogProduct): string => {
  if (product.href) return product.href;

  let categoryName = '';

  if (typeof product.category === 'string') {
    categoryName = product.category;
  } else if (product.category && typeof product.category === 'object') {
    const categoryObj = product.category as unknown as { id?: string; name?: string };
    categoryName = categoryObj.id || categoryObj.name || '';
  }

  const normalizedCategory = categoryName.toLowerCase();
  const normalizedSubcategory = (product.subcategory || '').toLowerCase();
  const productKey = getProductUrlKey(product);

  if (normalizedSubcategory === 'fragrances' || normalizedCategory === 'fragrances') {
    return `/catalog/fragrances/${productKey}`;
  }
  if (normalizedCategory === 'accessories' || normalizedSubcategory === 'accessories') {
    return `/catalog/accessories/${productKey}`;
  }
  if (normalizedCategory === 'women' || product.id.startsWith('w-')) {
    return `/catalog/women/${productKey}`;
  }

  return `/catalog/men/${productKey}`;
};

export default function CatalogProductCard({ product }: CatalogProductCardProps) {
  const { t } = useTranslation();

  return (
    <LandingProductCard
      id={product.id}
      href={getProductCategoryPath(product)}
      image={product.image}
      title={product.title}
      price={product.price}
      ctaLabel={t.catalog.viewDetails}
    />
  );
}
