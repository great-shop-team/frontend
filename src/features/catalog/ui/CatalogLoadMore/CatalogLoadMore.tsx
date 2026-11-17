'use client';

import { formatMessage, useTranslation } from '@/i18n/useTranslation';
import { catalogLoadMore } from '@/features/catalog/ui/catalogClasses';

type CatalogLoadMoreProps = {
  viewed: number;
  total: number | string;
  onClick?: () => void;
};

export default function CatalogLoadMore({ viewed, total, onClick }: CatalogLoadMoreProps) {
  const { t } = useTranslation();

  return (
    <div className={catalogLoadMore.root}>
      <p className={catalogLoadMore.summary}>
        {formatMessage(t.catalog.viewedProducts, { viewed, total })}
      </p>
      {onClick ? (
        <button type="button" className={catalogLoadMore.button} onClick={onClick}>
          {t.catalog.loadMore}
        </button>
      ) : null}
    </div>
  );
}
