'use client';

import Link from 'next/link';

import type { CatalogCollectionSlug } from '@/features/catalog/model/catalogCollection';
import { useCatalogCollectionBanner } from '@/features/catalog/lib/useCatalogCollectionBanner';

import { catalogSection } from '../catalogClasses';

type CatalogCollectionBannerProps = {
  collection: CatalogCollectionSlug;
};

export default function CatalogCollectionBanner({ collection }: CatalogCollectionBannerProps) {
  const { image, title, description, shopNowLabel } = useCatalogCollectionBanner(collection);

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
