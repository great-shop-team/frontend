'use client';

import { useTranslation } from '@/i18n/useTranslation';
import { catalogToolbar } from '@/features/catalog/ui/catalogClasses';

type CatalogFilterProps = {
  onClick?: () => void;
  activeCount?: number;
};

export default function CatalogFilter({ onClick, activeCount = 0 }: CatalogFilterProps) {
  const { t } = useTranslation();

  return (
    <button type="button" className={`${catalogToolbar.control} shrink-0`} onClick={onClick}>
      {t.catalog.filter}
      {activeCount > 0 ? (
        <span className="ml-1 inline-flex min-w-5 items-center justify-center rounded-full bg-dark px-1.5 text-xs text-white">
          {activeCount}
        </span>
      ) : null}
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
          d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
        />
      </svg>
    </button>
  );
}
