'use client';

import CatalogFilter from '@/features/catalog/ui/CatalogFilter/CatalogFilter';
import { formatMessage, useTranslation } from '@/i18n/useTranslation';
import { catalogToolbar } from '@/features/catalog/ui/catalogClasses';

type CatalogToolbarProps = {
  stylesCount: number;
  onFilterClick: () => void;
  activeFilterCount?: number;
};

export default function CatalogToolbar({
  stylesCount,
  onFilterClick,
  activeFilterCount = 0,
}: CatalogToolbarProps) {
  const { t } = useTranslation();

  return (
    <div className={catalogToolbar.root}>
      <div className={catalogToolbar.controls}>
        <button
          type="button"
          className={`${catalogToolbar.control} min-w-0 max-w-[52%] md:max-w-none`}
          onClick={onFilterClick}
        >
          <span className="min-w-0 truncate">{t.catalog.sort}</span>
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
        <CatalogFilter onClick={onFilterClick} activeCount={activeFilterCount} />
      </div>

      <span className={catalogToolbar.stylesCount}>
        {formatMessage(t.catalog.stylesFound, { count: stylesCount })}
      </span>
    </div>
  );
}
