import { mapProductToCatalogCard, parseProducts } from '@/entities/product';
import type { Locale } from '@/i18n/config';
import productsMock from '@/data/products.json';
import type { CatalogCategory } from '@/features/catalog/model/catalogCategory';
import type { CatalogProduct } from '@/features/catalog/model/catalogProduct';
import type { Product } from '@/entities/product/model/types';

const allProducts: Product[] = parseProducts(productsMock);

export function getCatalogProducts(category: CatalogCategory, locale: Locale): CatalogProduct[] {
  return allProducts
    .filter((product) => product.category === category)
    .map((product) => mapProductToCatalogCard(product, locale));
}

export function getCatalogProductsCount(category: CatalogCategory) {
  return allProducts.filter((product) => product.category === category).length;
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
