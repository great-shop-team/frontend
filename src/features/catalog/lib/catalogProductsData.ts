import { mapProductToCatalogCard, parseProducts } from '@/entities/product';
import type { Locale } from '@/i18n/config';
import productsMock from '@/data/products.json';
import type { CatalogScope } from '@/features/catalog/model/catalogCategory';
import type { CatalogProduct } from '@/features/catalog/model/catalogProduct';
import type { Product } from '@/entities/product/model/types';

const allProducts: Product[] = parseProducts(productsMock);

export type CatalogFilters = {
  subcategory?: string | string[];
  type?: string;
  brand?: string[];
  color?: string[];
  size?: string[];
  sort?: import('@/features/catalog/model/catalogFilters').CatalogSortOption;
};

export function getCatalogProducts(
  category: CatalogScope,
  locale: Locale,
  filters: CatalogFilters = {},
): CatalogProduct[] {
  return allProducts
    .filter((product) => {
      if (category === 'fragrances') return product.subcategory === 'fragrances';
      if (category === 'accessories') {
        return product.category === 'accessories' && product.subcategory !== 'fragrances';
      }
      if (category !== 'all' && product.category !== category) return false;
      if (filters.subcategory) {
        const selected = Array.isArray(filters.subcategory)
          ? filters.subcategory
          : [filters.subcategory];
        if (selected.length > 0 && !selected.includes(product.subcategory)) return false;
      }
      if (filters.type && product.type !== filters.type) return false;
      return true;
    })
    .map((product) => mapProductToCatalogCard(product, locale));
}

export function getCatalogProductsCount(category: CatalogScope, filters: CatalogFilters = {}) {
  return allProducts.filter((product) => {
    if (category === 'fragrances') return product.subcategory === 'fragrances';
    if (category === 'accessories') {
      return product.category === 'accessories' && product.subcategory !== 'fragrances';
    }
    if (category !== 'all' && product.category !== category) return false;
    if (filters.subcategory) {
      const selected = Array.isArray(filters.subcategory)
        ? filters.subcategory
        : [filters.subcategory];
      if (selected.length > 0 && !selected.includes(product.subcategory)) return false;
    }
    if (filters.type && product.type !== filters.type) return false;
    return true;
  }).length;
}

export function getProductById(id: string) {
  return allProducts.find((product) => product.id === id) ?? null;
}

export function getProductBySlug(slug: string) {
  return allProducts.find((product) => product.slug === slug) ?? null;
}

export function getRelatedCatalogProducts(
  currentProduct: Product,
  locale: Locale,
  limit = 3,
): CatalogProduct[] {
  const sameSubcategory = allProducts.filter(
    (product) =>
      product.id !== currentProduct.id &&
      product.category === currentProduct.category &&
      product.subcategory === currentProduct.subcategory,
  );

  const fallbackSameCategory = allProducts.filter(
    (product) =>
      product.id !== currentProduct.id &&
      product.category === currentProduct.category &&
      !sameSubcategory.some((relatedProduct) => relatedProduct.id === product.id),
  );

  return [...sameSubcategory, ...fallbackSameCategory]
    .slice(0, limit)
    .map((product) => mapProductToCatalogCard(product, locale));
}
