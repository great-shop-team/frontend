'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { catalogCategoriesConfig } from '@/features/catalog/config/catalogCategories';
import {
  catalogNavCategories,
  catalogNavCollections,
} from '@/features/catalog/config/catalogNavMenu';
import { collectionSlugToI18nKey } from '@/features/catalog/model/catalogCollection';
import { useTranslation } from '@/i18n/useTranslation';
import { getHeaderActionClass, isActivePath } from '@/widgets/Header/headerActionClasses';

import { catalogNavMenu } from './navigationClasses';

export default function CatalogNavMenu() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const isCatalogActive = isActivePath(pathname, '/catalog');
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <li
      className={catalogNavMenu.trigger}
      onMouseEnter={open}
      onMouseLeave={close}
      onFocus={open}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
          close();
        }
      }}
    >
      <Link
        href="/catalog/women"
        className={getHeaderActionClass(isCatalogActive)}
        aria-current={isCatalogActive ? 'page' : undefined}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {t.nav.catalog}
      </Link>

      {isOpen ? (
        <div className={catalogNavMenu.dropdown}>
          <div className={catalogNavMenu.panel}>
            <nav aria-label={t.catalog.categoryNavAriaLabel}>
              <ul className={catalogNavMenu.panelList}>
                {catalogNavCategories.map((category) => {
                  const href = catalogCategoriesConfig[category].href;
                  const isActive = isActivePath(pathname, href);

                  return (
                    <li key={category}>
                      <Link
                        href={href}
                        className={`${catalogNavMenu.panelLink} ${
                          isActive ? catalogNavMenu.panelLinkActive : ''
                        }`}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        {t.catalog.categories[category].navLabel}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className={catalogNavMenu.divider} role="separator" />

            <nav aria-label={t.catalog.collectionsNavAriaLabel}>
              <ul className={catalogNavMenu.panelList}>
                {catalogNavCollections.map(({ slug, emoji }) => {
                  const href = `/catalog/collection/${slug}`;
                  const isActive = isActivePath(pathname, href);
                  const copyKey = collectionSlugToI18nKey(slug);

                  return (
                    <li key={slug}>
                      <Link
                        href={href}
                        className={`${catalogNavMenu.tagLink} ${
                          isActive ? catalogNavMenu.panelLinkActive : ''
                        }`}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <span className={catalogNavMenu.tagEmoji} aria-hidden="true">
                          {emoji}
                        </span>
                        <span>{t.catalog.collections[copyKey].navLabel}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>
      ) : null}
    </li>
  );
}
