import type { Locale } from '@/i18n/config';
import { toImageUrl } from '@/store/api/mappers/products.mapper';
import type { CurrencyAmount, ProductImageRecord, ProductVariant } from '@/store/types';

export function parseMoneyAmount(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    const amount = Number(value);
    if (Number.isFinite(amount)) return amount;
  }
  return undefined;
}

export function resolveVariantPrice(args: {
  variants: ProductVariant[];
  currencies?: CurrencyAmount[];
}): { amount: number; currency: string } | undefined {
  const variantIds = new Set(args.variants.map((variant) => Number(variant.id)));

  const fromCurrencies = (args.currencies ?? [])
    .filter((item) => variantIds.has(Number(item.product_variant)))
    .map((item) => ({
      amount: parseMoneyAmount(item.amount),
      currency: item.currency_code || 'USD',
    }))
    .filter((item): item is { amount: number; currency: string } => item.amount != null)
    .sort((a, b) => a.amount - b.amount);

  if (fromCurrencies[0]) return fromCurrencies[0];

  const fromVariants = args.variants
    .map((variant) => parseMoneyAmount(variant.price))
    .filter((amount): amount is number => amount != null)
    .sort((a, b) => a - b);

  if (fromVariants[0] != null) {
    return { amount: fromVariants[0], currency: 'USD' };
  }

  return undefined;
}

export function formatCatalogPrice(amount: number, currency: string, locale: Locale): string {
  const formatted = new Intl.NumberFormat(locale === 'uk' ? 'uk-UA' : 'en-US', {
    maximumFractionDigits: 0,
  }).format(amount);
  const symbol = currency === 'USD' ? '$' : currency;
  return `${formatted} ${symbol}`;
}

export function pickMainImageUrl(images: ProductImageRecord[]): string | undefined {
  const sorted = [...images].sort(
    (a, b) => Number(b.is_main) - Number(a.is_main) || a.sort_order - b.sort_order,
  );
  const src = sorted[0]?.image;
  return src ? toImageUrl(src) : undefined;
}
