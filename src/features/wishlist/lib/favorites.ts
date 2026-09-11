import type { Favorite, ProductVariant, WishlistItem } from '@/store/types';

function readId(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && /^\d+$/.test(value.trim())) return Number(value);
  return null;
}

export function toApiProductId(productId: string): number | null {
  return readId(productId);
}

export function pickVariantForProduct(
  productId: number,
  variants: ProductVariant[],
): ProductVariant | undefined {
  const list = variants.filter(
    (variant) => Number(variant.product) === productId && variant.is_active !== false,
  );
  return list.find((variant) => variant.stock > 0) ?? list[0];
}

export function productIdFromVariantId(
  variantId: number,
  variants: ProductVariant[],
): string | null {
  const variant = variants.find((item) => Number(item.id) === variantId);
  return variant ? String(variant.product) : null;
}

export function toFavoriteList(response: unknown): Favorite[] {
  if (Array.isArray(response)) {
    return response.map(normalizeFavorite).filter((item): item is Favorite => item != null);
  }

  if (response && typeof response === 'object') {
    const results = (response as { results?: unknown }).results;
    if (Array.isArray(results)) {
      return results.map(normalizeFavorite).filter((item): item is Favorite => item != null);
    }
  }

  const single = normalizeFavorite(response);
  return single ? [single] : [];
}

function readVariant(record: Record<string, unknown>): {
  variantId: number | null;
  productId: string | null;
} {
  const raw = record.product_variant ?? record.product ?? record.product_id;

  if (raw && typeof raw === 'object') {
    const nested = raw as Record<string, unknown>;
    return {
      variantId: readId(nested.id),
      productId: readId(nested.product) != null ? String(readId(nested.product)) : null,
    };
  }

  const variantId = readId(raw);
  return { variantId, productId: null };
}

export function normalizeFavorite(raw: unknown): Favorite | null {
  if (!raw || typeof raw !== 'object') return null;

  const record = raw as Record<string, unknown>;
  const id = readId(record.id);
  const { variantId, productId } = readVariant(record);

  if (id == null || variantId == null) return null;

  return {
    id,
    variantId,
    productId: productId ?? '',
  };
}

export function toWishlistItem(
  favorite: Favorite,
  variants: ProductVariant[] = [],
): WishlistItem {
  const productId =
    favorite.productId || productIdFromVariantId(favorite.variantId, variants) || '';

  return {
    productId,
    favoriteId: favorite.id,
    variantId: favorite.variantId,
  };
}
