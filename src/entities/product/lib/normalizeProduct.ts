import type { CatalogCategory } from '@/features/catalog/model/catalogCategory';
import type { Product, ProductPrice } from '@/entities/product/model/types';

type RawRecord = Record<string, unknown>;

const asRecord = (value: unknown): RawRecord =>
  value && typeof value === 'object' ? (value as RawRecord) : {};

const asString = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback;

const asBoolean = (value: unknown, fallback = true): boolean =>
  typeof value === 'boolean' ? value : fallback;

const toStringArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];

const toSizeLabels = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (typeof item === 'string') {
        return item;
      }

      return asString(asRecord(item).size);
    })
    .filter((size) => size.length > 0);
};

const toPrice = (value: unknown, legacyPrice?: unknown): ProductPrice => {
  const price = asRecord(value);

  if (typeof price.amount === 'number') {
    return {
      amount: price.amount,
      currency: asString(price.currency, 'USD'),
    };
  }

  if (typeof value === 'number') {
    return { amount: value, currency: 'USD' };
  }

  if (typeof legacyPrice === 'string') {
    const digits = legacyPrice.replace(/[^\d.]/g, '');
    const amount = Number(digits);

    if (Number.isFinite(amount) && amount > 0) {
      const currency = legacyPrice.includes('₴') ? 'UAH' : 'USD';
      return { amount, currency };
    }
  }

  return { amount: 0, currency: 'USD' };
};

const toColors = (value: unknown): Product['options']['colors'] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      const color = asRecord(item);
      const name = asString(color.name);
      const hex = asString(color.hex);

      if (!name) {
        return null;
      }

      return { name, hex: hex || '#000000' };
    })
    .filter((item): item is Product['options']['colors'][number] => item !== null);
};

const extractImages = (raw: RawRecord): string[] => {
  const topLevel = toStringArray(raw.images);

  if (topLevel.length > 0) {
    return topLevel;
  }

  const legacyImage = asRecord(raw.image);
  const legacySrc = asString(legacyImage.src);

  if (legacySrc) {
    return [legacySrc];
  }

  const options = asRecord(raw.options);
  const colors = options.colors;

  if (!Array.isArray(colors) || colors.length === 0) {
    return [];
  }

  const firstColor = asRecord(colors[0]);
  const colorImages = toStringArray(firstColor.images);

  if (colorImages.length > 0) {
    return colorImages;
  }

  return toStringArray(firstColor.thumbnails);
};

const toOptions = (value: unknown, legacySizes?: unknown): Product['options'] => {
  const options = asRecord(value);
  const colors = toColors(options.colors);
  let sizes = toSizeLabels(options.sizes);

  if (sizes.length === 0 && Array.isArray(options.colors) && options.colors.length > 0) {
    sizes = toSizeLabels(asRecord(options.colors[0]).sizes);
  }

  if (sizes.length === 0) {
    sizes = toStringArray(legacySizes);
  }

  return { colors, sizes };
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const mapSourceCategoryToCatalog = (
  sourceCategory: string,
): { category: CatalogCategory; sourceCategory: string } | null => {
  const key = sourceCategory.trim().toLowerCase();

  switch (key) {
    case 'women':
      return { category: 'women', sourceCategory: sourceCategory };
    case 'men':
      return { category: 'men', sourceCategory: sourceCategory };
    case 'unisex':
      return { category: 'unisex', sourceCategory: sourceCategory };
    case 'accessories':
      return { category: 'accessories', sourceCategory: sourceCategory };
    case 'perfumes':
    case 'fragrances':
      return { category: 'perfumes', sourceCategory: sourceCategory };
    default:
      return null;
  }
};

export function productMatchesCatalogCategory(
  product: Product,
  category: CatalogCategory,
): boolean {
  const sourceKey = product.sourceCategory?.trim().toLowerCase();

  switch (category) {
    case 'women':
      return sourceKey === 'women';
    case 'men':
      return sourceKey === 'men';
    case 'unisex':
      return sourceKey === 'unisex';
    case 'accessories':
      return sourceKey === 'accessories';
    case 'perfumes':
      return sourceKey === 'perfumes' || product.subcategory === 'fragrances';
    default:
      return false;
  }
}

export function productMatchesCatalogCollection(product: Product, tag: string): boolean {
  return product.tags.includes(tag);
}

export function normalizeProduct(value: unknown, index: number): Product | null {
  const raw = asRecord(value);
  const sourceCategory = asString(raw.category);
  const mappedCategory = mapSourceCategoryToCatalog(sourceCategory);

  if (!mappedCategory) {
    return null;
  }

  const { category, sourceCategory: normalizedSource } = mappedCategory;
  const name = asString(raw.name) || asString(raw.title, `Product ${index + 1}`);
  const id = asString(raw.id, `${category}-${index + 1}`);
  const slug = asString(raw.slug, slugify(name));
  const subcategory = asString(
    raw.subcategory,
    normalizedSource.toLowerCase() === 'perfumes' ? 'fragrances' : 'clothing',
  );

  return {
    id,
    slug,
    name,
    category,
    sourceCategory: normalizedSource,
    subcategory,
    type: asString(raw.type, 'apparel'),
    description: asString(raw.description),
    price: toPrice(raw.price, raw.price),
    images: extractImages(raw),
    options: toOptions(raw.options, raw.sizes),
    tags: toStringArray(raw.tags),
    inStock: asBoolean(raw.inStock, true),
  };
}

export function parseProducts(value: unknown): Product[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item, index) => normalizeProduct(item, index))
    .filter((item): item is Product => item !== null);
}
