import type { Locale } from '@/i18n/config';
import type { CatalogCategory } from '@/features/catalog/model/catalogCategory';
import type { CatalogProduct } from '@/features/catalog/model/catalogProduct';
import { buildProductHref } from '@/features/catalog/lib/buildProductHref';
import { toImageUrl } from '@/store/api/mappers/products.mapper';
import type {
  ApiProduct,
  Brand,
  CatalogColor,
  CatalogSize,
  CurrencyAmount,
  ProductImageRecord,
  ProductVariant,
  Subcategory,
} from '@/store/types';

const PLACEHOLDER_IMAGE = '/images/product1.png';

type MapApiProductArgs = {
  product: ApiProduct;
  category: CatalogCategory;
  locale: Locale;
  brandById: Map<number, Brand>;
  subcategoryById: Map<number, Subcategory>;
  variants: ProductVariant[];
  colorsById: Map<number, CatalogColor>;
  sizesById: Map<number, CatalogSize>;
  images: ProductImageRecord[];
  currencies: CurrencyAmount[];
};

function formatAmount(amount: number, currency: string, locale: Locale) {
  const formatted = new Intl.NumberFormat(locale === 'uk' ? 'uk-UA' : 'en-US', {
    maximumFractionDigits: 0,
  }).format(amount);
  const symbol = currency === 'USD' ? '$' : currency;
  return `${formatted} ${symbol}`;
}

export function mapApiProductToCatalogCard({
  product,
  category,
  locale,
  brandById,
  subcategoryById,
  variants,
  colorsById,
  sizesById,
  images,
  currencies,
}: MapApiProductArgs): CatalogProduct {
  const productVariants = variants.filter(
    (variant) => variant.product === product.id && variant.is_active,
  );
  const variantIds = new Set(productVariants.map((variant) => variant.id));

  const productImages = images
    .filter((image) => variantIds.has(image.product_variant))
    .sort((a, b) => Number(b.is_main) - Number(a.is_main) || a.sort_order - b.sort_order);

  const priceAmounts = currencies
    .filter((item) => variantIds.has(item.product_variant))
    .map((item) => ({
      amount: Number(item.amount),
      currency: item.currency_code || 'USD',
    }))
    .filter((item) => Number.isFinite(item.amount));

  const lowestPrice = priceAmounts.sort((a, b) => a.amount - b.amount)[0];
  const subcategory = subcategoryById.get(product.subcategory);
  const brand = brandById.get(product.brand);
  const imageSrc = productImages[0]?.image ? toImageUrl(productImages[0].image) : PLACEHOLDER_IMAGE;

  const uniqueSizes = [
    ...new Set(
      productVariants
        .map((variant) => sizesById.get(variant.size)?.name)
        .filter((name): name is string => Boolean(name)),
    ),
  ];

  const uniqueColors = [
    ...new Map(
      productVariants
        .map((variant) => colorsById.get(variant.color))
        .filter((color): color is CatalogColor => Boolean(color))
        .map((color) => [color.id, { name: color.name, hex: color.hex_code }] as const),
    ).values(),
  ];

  const inStock =
    productVariants.length === 0
      ? product.is_active
      : productVariants.some((variant) => variant.stock > 0);

  return {
    id: String(product.id),
    slug: product.slug,
    category,
    subcategory: subcategory?.slug,
    type: subcategory?.name,
    title: product.name,
    description: product.description,
    price: lowestPrice ? formatAmount(lowestPrice.amount, lowestPrice.currency, locale) : '—',
    image: {
      src: imageSrc,
      alt: product.name,
    },
    sizes: uniqueSizes.length > 0 ? uniqueSizes : undefined,
    colors: uniqueColors.length > 0 ? uniqueColors : undefined,
    inStock,
    href: buildProductHref(category, product),
    brandId: product.brand,
    brandName: brand?.name,
    subcategoryId: product.subcategory,
    colorIds: productVariants.map((variant) => variant.color),
    sizeIds: productVariants.map((variant) => variant.size),
    priceValue: lowestPrice?.amount,
  };
}
