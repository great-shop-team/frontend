'use client';

import { useMemo, useState } from 'react';

import { useTranslation } from '@/i18n/useTranslation';

import {
  adminHeading,
  adminMessage,
  adminPanel,
  adminPanelHead,
  adminSearch,
  adminTable,
  adminTableWrap,
  adminTd,
  adminTh,
} from './adminClasses';

export type AdminRecord = {
  id: number;
  name: string;
  slug: string;
  is_active: boolean;
  is_hidden: boolean;
  category?: number;
};

type AdminDirectoryProps = {
  title: string;
  items: AdminRecord[] | undefined;
  isLoading: boolean;
  isError: boolean;
  categories?: { id: number; name: string }[];
  showCategory?: boolean;
};

export default function AdminDirectory({
  title,
  items,
  isLoading,
  isError,
  categories = [],
  showCategory = false,
}: AdminDirectoryProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const categoryName = useMemo(
    () => new Map(categories.map((category) => [category.id, category.name])),
    [categories],
  );

  const filtered = (items ?? []).filter((item) => {
    const haystack = `${item.name} ${item.slug}`.toLowerCase();
    return haystack.includes(query.trim().toLowerCase());
  });

  return (
    <section className={adminPanel}>
      <div className={adminPanelHead}>
        <h2 className={adminHeading}>{title}</h2>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t.admin.search}
          aria-label={t.admin.search}
          className={adminSearch}
        />
      </div>
      {isLoading ? <p className={adminMessage}>{t.common.loading}</p> : null}
      {isError ? <p className={adminMessage}>{t.admin.loadError}</p> : null}
      {!isLoading && !isError && filtered.length === 0 ? <p className={adminMessage}>{t.admin.empty}</p> : null}
      {filtered.length > 0 ? (
        <div className={adminTableWrap}>
          <table className={adminTable}>
            <thead>
              <tr>
                <th className={adminTh}>{t.admin.name}</th>
                <th className={adminTh}>{t.admin.slug}</th>
                {showCategory ? <th className={adminTh}>{t.admin.parentCategory}</th> : null}
                <th className={adminTh}>{t.admin.status}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td className={adminTd}>{item.name}</td>
                  <td className={adminTd}>{item.slug}</td>
                  {showCategory ? (
                    <td className={adminTd}>
                      {item.category ? (categoryName.get(item.category) ?? '—') : '—'}
                    </td>
                  ) : null}
                  <td className={adminTd}>
                    {item.is_hidden
                      ? t.admin.hidden
                      : item.is_active === false
                        ? t.admin.inactive
                        : t.admin.active}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}
