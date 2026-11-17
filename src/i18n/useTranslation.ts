'use client';

import { useMemo } from 'react';

import { useI18n } from './I18nProvider';
import { getValidators } from './validators';

export function useTranslation() {
  const { locale, setLocale, t } = useI18n();

  const validators = useMemo(() => getValidators(t), [t]);

  return { locale, setLocale, t, validators };
}

export function formatMessage(template: string, values: Record<string, string | number>): string {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, String(value)),
    template,
  );
}
