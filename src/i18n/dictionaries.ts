import type { Locale } from './config';
import en from './locales/en';
import uk from './locales/uk';

import type { Dictionary } from './locales/en';

const dictionaries: Record<Locale, Dictionary> = {
  en,
  uk,
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
