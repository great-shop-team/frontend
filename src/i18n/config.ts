export const locales = ['en', 'uk'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const LOCALE_COOKIE = 'locale';

export const localeLabels: Record<Locale, string> = {
  en: 'ENG',
  uk: 'UKR',
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
