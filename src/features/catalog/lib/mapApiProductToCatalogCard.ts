import type { Locale } from '@/i18n/config';
import {
  resolveProductGroup,
  type CatalogListingSlug,
} from '@/features/catalog/model/catalogCategory';
import type { CatalogProduct } from '@/features/catalog/model/catalogProduct';
import { buildProductHref } from '@/features/catalog/lib/buildProductHref';
import {
  formatCatalogPrice,
  pickMainImageUrl,
  resolveVariantPrice,
} from '@/features/catalog/lib/resolveVariantOffer';
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

const PLACEHOLDER_IMAGES = {
  en: {
    src: '/images/catalog/photo-placeholder-en.svg',
    alt: 'No photo',
  },
  uk: {
    src: '/images/catalog/photo-placeholder-uk.svg',
    alt: 'Немає фото',
  },
} as const;

type MapApiProductArgs = {
  product: ApiProduct;
  category: CatalogListingSlug;
  locale: Locale;
  brandById: Map<number, Brand>;
  subcategoryById: Map<number, Subcategory>;
  variants: ProductVariant[];
  colorsById: Map<number, CatalogColor>;
  sizesById: Map<number, CatalogSize>;
  images: ProductImageRecord[];
  currencies: CurrencyAmount[];
  categoryIdBySlug: Map<string, number>;
};

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
  categoryIdBySlug,
}: MapApiProductArgs): CatalogProduct {
  const productId = Number(product.id);
  const productVariants = variants.filter(
    (variant) => Number(variant.product) === productId && variant.is_active !== false,
  );
  const variantIds = new Set(productVariants.map((variant) => Number(variant.id)));

  const productImages = images.filter((image) => variantIds.has(Number(image.product_variant)));

  const lowestPrice = resolveVariantPrice({ variants: productVariants, currencies });
  const subcategory = subcategoryById.get(Number(product.subcategory));
  const brand = brandById.get(Number(product.brand));
  const mainImageUrl = pickMainImageUrl(productImages);
  const image = mainImageUrl
    ? { src: mainImageUrl, alt: product.name }
    : PLACEHOLDER_IMAGES[locale];

  const uniqueSizes = [
    ...new Set(
      productVariants
        .map((variant) => sizesById.get(Number(variant.size))?.name)
        .filter((name): name is string => Boolean(name)),
    ),
  ];

  const uniqueColors = [
    ...new Map(
      productVariants
        .map((variant) => colorsById.get(Number(variant.color)))
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
    price: lowestPrice ? formatCatalogPrice(lowestPrice.amount, lowestPrice.currency, locale) : '—',
    image,
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
    genders: [...new Set(productVariants.map((variant) => variant.gender))],
    group: resolveProductGroup({
      subcategorySlug: subcategory?.slug,
      subcategoryName: subcategory?.name,
      subcategoryCategoryId: subcategory?.category,
      categoryIdBySlug,
    }),
    stockTotal: productVariants.reduce((sum, variant) => sum + variant.stock, 0),
  };
}
