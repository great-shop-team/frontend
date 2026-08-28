import type { Locale } from '@/i18n/config';
import type { Product } from '@/entities/product/model/types';
import type { CatalogProduct } from '@/features/catalog/model/catalogProduct';

export function formatProductPrice(price: Product['price'], locale: Locale): string {
  const formattedAmount = new Intl.NumberFormat(locale === 'uk' ? 'uk-UA' : 'en-US', {
    maximumFractionDigits: 0,
  }).format(price.amount);

  const displayCurrency = price.currency === 'USD' ? '$' : price.currency;

  return `${formattedAmount} ${displayCurrency}`;
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
    href: `/catalog/${product.category.toLowerCase()}/${product.slug || product.id}`,
  };
}
