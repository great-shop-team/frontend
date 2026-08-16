'use client';

import { useEffect, useRef, useState } from 'react';

import type { CatalogSortOption } from '@/features/catalog/model/catalogFilters';
import { catalogToolbar } from '@/features/catalog/ui/catalogClasses';
import { useTranslation } from '@/i18n/useTranslation';

type CatalogSortProps = {
  value?: CatalogSortOption;
  onChange: (value: CatalogSortOption) => void;
};

export default function CatalogSort({ value = 'featured', onChange }: CatalogSortProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [isOpen]);

  const options: Array<{ value: CatalogSortOption; label: string }> = [
    { value: 'featured', label: t.catalog.sortOptions.featured },
    { value: 'price_asc', label: t.catalog.sortOptions.priceAsc },
    { value: 'price_desc', label: t.catalog.sortOptions.priceDesc },
    { value: 'name_asc', label: t.catalog.sortOptions.nameAsc },
    { value: 'name_desc', label: t.catalog.sortOptions.nameDesc },
  ];

  const currentLabel = options.find((option) => option.value === value)?.label ?? t.catalog.sort;

  return (
    <div ref={rootRef} className="relative min-w-0 max-w-[52%] md:max-w-none">
      <button
        type="button"
        className={catalogToolbar.control}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="min-w-0 truncate">{currentLabel}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
          />
        </svg>
      </button>

      {isOpen ? (
        <ul
          className="absolute top-full left-0 z-20 mt-2 w-[min(calc(100vw-2rem),260px)] min-w-[200px] rounded-sm border border-black/8 bg-white py-1 text-dark shadow-[0_8px_24px_rgb(0_0_0/10%)]"
          role="listbox"
          aria-label={t.catalog.sort}
        >
          {options.map((option) => (
            <li key={option.value} role="option" aria-selected={option.value === value}>
              <button
                type="button"
                className={`w-full min-h-11 cursor-pointer border-none bg-transparent px-4 py-3 text-left text-sm transition-colors hover:bg-black/5 ${
                  option.value === value ? 'bg-black/5 font-medium' : ''
                }`}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
