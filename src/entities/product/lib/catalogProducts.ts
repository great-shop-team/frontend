import productsMock from '@/data/products.json';
import type { CatalogCategory } from '@/features/catalog/model/catalogCategory';

import type { Product } from '../model/types';
import { parseProducts, productMatchesCatalogCategory } from './normalizeProduct';

export const catalogProducts: Product[] = parseProducts(productsMock);

export function getCatalogProductById(id: string): Product | null {
  return catalogProducts.find((product) => product.id === id) ?? null;
}

export function getRelatedCatalogProducts(product: Product, limit = 3): Product[] {
  return catalogProducts
    .filter(
      (candidate) =>
        candidate.id !== product.id && productMatchesCatalogCategory(candidate, product.category),
    )
    .slice(0, limit);
}

export function getProductDetailPath(product: Product): string {
  if (product.subcategory === 'fragrances') {
    return `/catalog/fragrances/${product.id}`;
  }

  return `/catalog/${product.category as CatalogCategory}/${product.id}`;
}
