'use client';

import Link from 'next/link';

import { catalogRoutes } from '@/features/catalog/config/catalogRoutes';
import { useTranslation } from '@/i18n/useTranslation';

import { brandColumns } from './brandsConfig';
import { headerNav } from './navigationClasses';

const BRANDS_PREVIEW_COUNT = 10;

export default function BrandsMegaMenu() {
  const { t } = useTranslation();

  return (
    <div className={headerNav.brandsLayout}>
      <div className={headerNav.brandsGrid}>
        {brandColumns.map((column) => (
          <div key={column.range}>
            <p className={headerNav.shopColumnTitle}>{column.range}</p>
            <ul className={headerNav.shopColumnList}>
              {column.brands.slice(0, BRANDS_PREVIEW_COUNT).map((brand) => (
                <li key={brand}>
                  <Link href={catalogRoutes.women} className={headerNav.shopColumnLink}>
                    {brand}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className={headerNav.brandsFooter}>
        <Link href={catalogRoutes.women} className={headerNav.shopColumnLink}>
          {t.nav.viewAllBrands}
        </Link>
      </div>
    </div>
  );
}
