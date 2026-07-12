'use client';

import Link from 'next/link';

import { catalogRoutes } from '@/features/catalog/config/catalogRoutes';
import { useTranslation } from '@/i18n/useTranslation';
import { useGetBrandsQuery } from '@/store/endpoints/brandsEndpoints';

import { headerNav } from './navigationClasses';

const BRANDS_PREVIEW_COUNT = 10;

function buildBrandColumns(brands: string[]) {
  const grouped: Array<{ range: string; brands: string[] }> = [
    { range: 'A-C', brands: [] },
    { range: 'D-H', brands: [] },
    { range: 'I-L', brands: [] },
    { range: 'M-P', brands: [] },
    { range: 'R-Z', brands: [] },
  ];

  brands.forEach((brand) => {
    const firstLetter = (brand || '').charAt(0).toUpperCase();

    if (firstLetter >= 'A' && firstLetter <= 'C') {
      grouped[0].brands.push(brand);
    } else if (firstLetter >= 'D' && firstLetter <= 'H') {
      grouped[1].brands.push(brand);
    } else if (firstLetter >= 'I' && firstLetter <= 'L') {
      grouped[2].brands.push(brand);
    } else if (firstLetter >= 'M' && firstLetter <= 'P') {
      grouped[3].brands.push(brand);
    } else {
      grouped[4].brands.push(brand);
    }
  });

  return grouped;
}

export default function BrandsMegaMenu() {
  const { t } = useTranslation();
  const { data: brands } = useGetBrandsQuery();

  const columns = buildBrandColumns((brands ?? []).map((item) => item.name));

  return (
    <div className={headerNav.brandsLayout}>
      <div className={headerNav.brandsGrid}>
        {columns.map((column) => (
          <div key={column.range}>
            <p className={headerNav.shopColumnTitle}>{column.range}</p>
            <ul className={headerNav.shopColumnList}>
              {column.brands.slice(0, BRANDS_PREVIEW_COUNT).map((brand) => (
                <li key={brand}>
                  <Link href={catalogRoutes.brands} className={headerNav.shopColumnLink}>
                    {brand}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className={headerNav.brandsFooter}>
        <Link href={catalogRoutes.brands} className={headerNav.shopColumnLink}>
          {t.nav.viewAllBrands}
        </Link>
      </div>
    </div>
  );
}
