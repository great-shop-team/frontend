'use client';

import Link from 'next/link';

import { useCatalogListing } from '@/features/catalog/lib/useCatalogListing';
import { useLandingData } from '@/features/landing/lib/useLandingData';
import { useTranslation } from '@/i18n/useTranslation';
import LandingProductCard from '../LandingProductCard/LandingProductCard';
import { landingSection } from '../landingSectionClasses';

const BESTSELLERS_LIMIT = 3;

export default function BestSellersSection() {
  const { t } = useTranslation();
  const { labels } = useLandingData();
  const { products, isLoading, isError } = useCatalogListing('all');
  const visibleProducts = products.slice(0, BESTSELLERS_LIMIT);

  return (
    <section id="recently-released" className={landingSection.section}>
      <div className={`${landingSection.sectionContent} flex flex-col gap-8`}>
        <div className="flex items-baseline justify-between gap-3">
          <h2 className={landingSection.sectionTitle}>{labels.recentlyReleased}</h2>
          <Link href="/catalog" className={landingSection.viewAll}>
            {labels.shopAll}
          </Link>
        </div>

        {isLoading ? (
          <p className="py-10 text-center text-dark/60">{t.common.loading}</p>
        ) : isError && visibleProducts.length === 0 ? (
          <p className="py-10 text-center text-dark/60">{t.catalog.loadError}</p>
        ) : visibleProducts.length === 0 ? (
          <p className="py-10 text-center text-dark/60">{t.catalog.empty}</p>
        ) : (
          <div className={landingSection.productGrid}>
            {visibleProducts.map((product) => (
              <LandingProductCard
                key={product.id}
                id={product.id}
                href={product.href}
                image={product.image}
                title={product.title}
                price={product.price}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
