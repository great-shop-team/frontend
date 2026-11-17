'use client';

import Link from 'next/link';

import type { CatalogScope } from '@/features/catalog/model/catalogCategory';
import { useCatalogBanner } from '@/features/catalog/lib/useCatalogBanner';

import { catalogSection } from '../catalogClasses';

type CatalogBannerProps = {
  category: CatalogScope;
};

export default function CatalogBanner({ category }: CatalogBannerProps) {
  const { image, title, description, shopNowLabel } = useCatalogBanner(category);

  return (
    <section
      className={catalogSection.banner}
      style={{ backgroundImage: `url(${image.src})` }}
      aria-label={image.alt}
    >
      <div className={catalogSection.bannerContent}>
        <h1 className={catalogSection.bannerTitle}>{title}</h1>
        <p className={catalogSection.bannerDescription}>{description}</p>
        <Link href="#catalog-products" className="btn-primary">
          {shopNowLabel}
        </Link>
      </div>
    </section>
  );
}
