'use client';

import { useEffect, useRef, useState } from 'react';

import { localeLabels, locales, type Locale } from '@/i18n/config';
import { useTranslation } from '@/i18n/useTranslation';

type LanguageSwitcherProps = {
  variant?: 'inline' | 'dropdown';
};

export default function LanguageSwitcher({ variant = 'inline' }: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleClickOutside = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  if (variant === 'dropdown') {
    return (
      <div ref={rootRef} className="relative">
        <button
          type="button"
          className="inline-flex cursor-pointer items-center gap-1.5 border-none bg-transparent px-0 py-0 text-inherit uppercase"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-label={t.common.language}
        >
          {localeLabels[locale]}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className={`size-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            aria-hidden
          >
            <path
              fillRule="evenodd"
              d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {isOpen ? (
          <ul
            className="absolute top-full right-0 z-110 mt-2 min-w-[88px] rounded-sm border border-black/5 bg-white py-1 text-dark shadow-[0_8px_24px_rgb(0_0_0/8%)]"
            role="listbox"
            aria-label={t.common.language}
          >
            {locales.map((code) => (
              <li key={code} role="option" aria-selected={locale === code}>
                <button
                  type="button"
                  className={`w-full cursor-pointer border-none bg-transparent px-4 py-2 text-left text-base font-normal leading-5 uppercase transition-colors hover:bg-black/5 ${
                    locale === code ? 'bg-black/5' : ''
                  }`}
                  onClick={() => {
                    setLocale(code as Locale);
                    setIsOpen(false);
                  }}
                >
                  {localeLabels[code]}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    );
  }

  return (
    <div
      className="flex items-center gap-2 text-sm font-medium tracking-wide uppercase"
      role="group"
      aria-label={t.common.language}
    >
      {locales.map((code, index) => (
        <span key={code} className="inline-flex items-center gap-2">
          {index > 0 ? (
            <span className="opacity-40 select-none" aria-hidden>
              /
            </span>
          ) : null}
          <button
            type="button"
            className={`cursor-pointer border-none bg-transparent px-0 py-1 text-inherit underline decoration-transparent transition-[text-decoration-color,opacity] duration-300 ease-in-out hover:decoration-inherit ${
              locale === code ? 'decoration-inherit' : ''
            }`}
            onClick={() => setLocale(code as Locale)}
            aria-pressed={locale === code}
            aria-label={code === 'uk' ? t.common.ukrainian : t.common.english}
          >
            {localeLabels[code]}
          </button>
        </span>
      ))}
    </div>
  );
}
