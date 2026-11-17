'use client';

import Link from 'next/link';

import { useTranslation } from '@/i18n/useTranslation';

export type CatalogBreadcrumbItem = {
  label: string;
  href?: string;
  current?: boolean;
};

type CatalogBreadcrumbsProps = {
  items: CatalogBreadcrumbItem[];
  variant?: 'banner' | 'page';
};

export default function CatalogBreadcrumbs({
  items,
  variant = 'page',
}: CatalogBreadcrumbsProps) {
  const { t } = useTranslation();

  if (items.length === 0) return null;

  const isBanner = variant === 'banner';

  return (
    <nav
      aria-label={t.product.aria.breadcrumb}
      className={`flex flex-wrap items-center gap-1.5 text-sm leading-[1.2] md:gap-2 md:text-[16px] ${
        isBanner ? 'text-white/80' : 'text-black/70'
      }`}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const isCurrent = item.current || isLast;
        const className = isBanner
          ? isCurrent
            ? 'text-white'
            : 'text-white/80 transition-opacity hover:text-white hover:opacity-100'
          : 'transition-opacity hover:opacity-100';

        return (
          <div key={`${item.label}-${index}`} className="flex items-center gap-1.5 md:gap-2">
            {item.href && !isCurrent ? (
              <Link href={item.href} className={className}>
                {item.label}
              </Link>
            ) : (
              <span className={className} aria-current={isCurrent ? 'page' : undefined}>
                {item.label}
              </span>
            )}
            {!isLast ? <span aria-hidden>/</span> : null}
          </div>
        );
      })}
    </nav>
  );
}
