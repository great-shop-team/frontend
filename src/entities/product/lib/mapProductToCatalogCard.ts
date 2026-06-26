import type { Locale } from '@/i18n/config';
import type { Product } from '@/entities/product/model/types';
import { getProductDetailPath } from '@/entities/product/lib/catalogProducts';
import type { CatalogProduct } from '@/features/catalog/model/catalogProduct';

export function formatProductPrice(price: Product['price'], locale: Locale): string {
  return new Intl.NumberFormat(locale === 'uk' ? 'uk-UA' : 'en-US', {
    style: 'currency',
    currency: price.currency,
    maximumFractionDigits: 0,
  }).format(price.amount);
}

export function mapProductToCatalogCard(product: Product, locale: Locale): CatalogProduct {
  const previewImage = product.images[0] ?? '';

  return {
    id: product.id,
    slug: product.slug,
    category: product.category,
    subcategory: product.subcategory,
    type: product.type,
    title: product.name,
    description: product.description,
    price: formatProductPrice(product.price, locale),
    image: {
      src: previewImage,
      alt: product.name,
    },
    sizes: product.options.sizes.length > 0 ? product.options.sizes : undefined,
    colors: product.options.colors.length > 0 ? product.options.colors : undefined,
    inStock: product.inStock,
    href: getProductDetailPath(product),
  };
}
