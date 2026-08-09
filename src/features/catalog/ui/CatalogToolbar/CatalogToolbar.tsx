'use client';

import CatalogFilter from '@/features/catalog/ui/CatalogFilter/CatalogFilter';
import CatalogSort from '@/features/catalog/ui/CatalogSort/CatalogSort';
import type { CatalogSortOption } from '@/features/catalog/model/catalogFilters';
import { formatMessage, useTranslation } from '@/i18n/useTranslation';
import { catalogToolbar } from '@/features/catalog/ui/catalogClasses';

type CatalogToolbarProps = {
  stylesCount: number;
  sort?: CatalogSortOption;
  onSortChange: (value: CatalogSortOption) => void;
  onFilterClick: () => void;
  activeFilterCount?: number;
};

export default function CatalogToolbar({
  stylesCount,
  sort,
  onSortChange,
  onFilterClick,
  activeFilterCount = 0,
}: CatalogToolbarProps) {
  const { t } = useTranslation();

  return (
    <div className={catalogToolbar.root}>
      <div className={catalogToolbar.controls}>
        <CatalogSort value={sort} onChange={onSortChange} />
        <CatalogFilter onClick={onFilterClick} activeCount={activeFilterCount} />
      </div>

      <span className={catalogToolbar.stylesCount}>
        {formatMessage(t.catalog.stylesFound, { count: stylesCount })}
      </span>
    </div>
  );
}
