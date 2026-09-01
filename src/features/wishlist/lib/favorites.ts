import type { Favorite, WishlistItem } from '@/store/types';

function readId(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && /^\d+$/.test(value.trim())) return Number(value);
  return null;
}

export function toApiProductId(productId: string): number | null {
  return readId(productId);
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

export function normalizeFavorite(raw: unknown): Favorite | null {
  if (!raw || typeof raw !== 'object') return null;

  const record = raw as Record<string, unknown>;
  const id = readId(record.id);
  const nestedProduct =
    record.product && typeof record.product === 'object'
      ? readId((record.product as Record<string, unknown>).id)
      : null;
  const productId =
    readId(record.product) ?? readId(record.product_id) ?? nestedProduct;

  if (id == null || productId == null) return null;

  return {
    id,
    productId: String(productId),
  };
}

export function toWishlistItem(favorite: Favorite): WishlistItem {
  return {
    productId: favorite.productId,
    favoriteId: favorite.id,
  };
}
