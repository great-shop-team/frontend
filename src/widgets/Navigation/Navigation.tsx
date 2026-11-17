'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { catalogRoutes } from '@/features/catalog/config/catalogRoutes';
import { useTranslation } from '@/i18n/useTranslation';
import { isActivePath } from '@/widgets/Header/headerActionClasses';

import BrandsMegaMenu from './BrandsMegaMenu';
import NavMegaMenuItem from './NavMegaMenuItem';
import ShopMegaMenu from './ShopMegaMenu';
import { getNavLinkClass, headerNav } from './navigationClasses';

export default function Navigation() {
  const { t } = useTranslation();
  const pathname = usePathname();

  const isCatalogActive = isActivePath(pathname, '/catalog');
  const isSalesActive = isActivePath(pathname, '/sales');

  return (
    <nav aria-label="Main" className="h-full">
      <ul className={headerNav.list}>
        <li>
          <Link
            href={catalogRoutes.index}
            className={getNavLinkClass(isCatalogActive)}
            aria-current={isCatalogActive ? 'page' : undefined}
          >
            {t.nav.catalog}
          </Link>
        </li>

        <li>
          <Link
            href="/sales"
            className={getNavLinkClass(isSalesActive)}
            aria-current={isSalesActive ? 'page' : undefined}
          >
            {t.nav.sales}
          </Link>
        </li>

        <NavMegaMenuItem
          label={t.nav.brands}
          href={catalogRoutes.brands}
          isActive={false}
          panelLabel={t.nav.brandsMenuAriaLabel}
          panel={<BrandsMegaMenu />}
        />

        <NavMegaMenuItem
          label={t.nav.shop}
          href={catalogRoutes.index}
          isActive={false}
          panelLabel={t.nav.shopMenuAriaLabel}
          panel={<ShopMegaMenu />}
        />
      </ul>
    </nav>
  );
}
