'use client';

import Link from 'next/link';

import { useTranslation } from '@/i18n/useTranslation';

import { headerNav } from './navigationClasses';
import { shopMenuColumns, shopMenuTiles } from './shopMenuConfig';

export default function ShopMegaMenu() {
  const { t } = useTranslation();
  const menu = t.nav.shopMenu;

  return (
    <div className={headerNav.shopGrid}>
      {shopMenuColumns.map((column) => (
        <div key={column.titleKey}>
          <p className={headerNav.shopColumnTitle}>
            {menu[column.titleKey as keyof typeof menu]}
          </p>
          <ul className={headerNav.shopColumnList}>
            {column.links.map((link) => (
              <li key={link.labelKey}>
                <Link href={link.href} className={headerNav.shopColumnLink}>
                  {menu[link.labelKey as keyof typeof menu]}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className={headerNav.shopTiles}>
        {shopMenuTiles.map((tile) => (
          <Link
            key={tile.labelKey}
            href={tile.href}
            className={`${headerNav.shopTile} ${tile.className}`}
          >
            {menu[tile.labelKey as keyof typeof menu]}
          </Link>
        ))}
      </div>
    </div>
  );
}
