'use client';

import Link from 'next/link';

import { useTranslation } from '@/i18n/useTranslation';
import {
  useGetCategoriesQuery,
  useGetSubcategoriesQuery,
} from '@/store/endpoints/categoriesEndpoints';
import { buildCatalogHref, catalogRoutes } from '@/features/catalog/config/catalogRoutes';
import { isCatalogCategory } from '@/features/catalog/model/catalogCategory';

import { headerNav } from './navigationClasses';
import { shopMenuColumns, shopMenuTiles } from './shopMenuConfig';

export default function ShopMegaMenu() {
  const { t } = useTranslation();
  const menu = t.nav.shopMenu;
  const { data: categories } = useGetCategoriesQuery();
  const { data: subcategories } = useGetSubcategoriesQuery();

  const categoryLinks =
    categories
      ?.filter((category) => category.is_active && !category.is_hidden)
      .slice(0, 10)
      .map((category) => ({
        key: String(category.id ?? category.slug),
        label: category.name,
        href: `/catalog/${category.slug}`,
      })) ?? [];

  const categorySlugById = new Map(
    (categories ?? []).map((category) => [category.id, category.slug]),
  );

  const filteredSubcategories =
    subcategories?.filter((subcategory) => subcategory.is_active && !subcategory.is_hidden) ?? [];

  const displayedSubcategories = filteredSubcategories.slice(0, 10);

  const typeLinks = displayedSubcategories.map((subcategory) => {
    const categorySlug = subcategory.category
      ? categorySlugById.get(subcategory.category)
      : undefined;

    return {
      key: String(subcategory.id ?? subcategory.slug),
      label: subcategory.name,
      href:
        categorySlug && isCatalogCategory(categorySlug)
          ? buildCatalogHref(categorySlug, { subcategory: subcategory.slug })
          : catalogRoutes.index,
    };
  });

  const maxPerColumn = 10;
  const columnsCount = Math.max(1, Math.ceil(typeLinks.length / maxPerColumn));
  const typeColumns = Array.from({ length: columnsCount }, (_, i) =>
    typeLinks.slice(i * maxPerColumn, (i + 1) * maxPerColumn),
  );

  return (
    <div className={headerNav.shopGrid}>
      {shopMenuColumns.map((column) => {
        if (column.titleKey === 'category') {
          return (
            <div key={column.titleKey}>
              <p className={headerNav.shopColumnTitle}>
                {menu[column.titleKey as keyof typeof menu]}
              </p>
              <ul className={headerNav.shopColumnList}>
                {categoryLinks.map((link) => (
                  <li key={link.key}>
                    <Link href={link.href} className={headerNav.shopColumnLink}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        }

        if (column.titleKey === 'type') {
          return (
            <div key={column.titleKey}>
              <p className={headerNav.shopColumnTitle}>
                {menu[column.titleKey as keyof typeof menu]}
              </p>
              <div
                className={headerNav.shopTypeColumns}
                style={{
                  gridTemplateColumns: `repeat(${Math.max(1, typeColumns.length)}, minmax(180px, 1fr))`,
                }}
              >
                {typeColumns.map((col, idx) => (
                  <ul key={idx} className={headerNav.shopTypeColumnList}>
                    {col.map((link) => (
                      <li key={link.key}>
                        <Link href={link.href} className={headerNav.shopTypeLink}>
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
              <div className={headerNav.shopColumnFooter}>
                <Link href={catalogRoutes.types} className={headerNav.shopColumnLink}>
                  {menu.viewAllTypes}
                </Link>
              </div>
            </div>
          );
        }

        return (
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
        );
      })}

      <div className={headerNav.shopTiles}>
        {shopMenuTiles.map((tile) => (
          <Link
            key={tile.labelKey}
            href={tile.href}
            className={`${headerNav.shopTile} ${tile.className}`}
            style={{
              backgroundImage: `url(${tile.background})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            {menu[tile.labelKey as keyof typeof menu]}
          </Link>
        ))}
      </div>
    </div>
  );
}
