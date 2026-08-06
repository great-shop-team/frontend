'use client';

import Link from 'next/link';

import { useLandingData } from '@/features/landing/lib/useLandingData';
import type { CatalogProduct } from '@/features/catalog/model/catalogProduct';
import ClothingProductCard from './ClothingProductCard';
import { landingSection } from '../landingSectionClasses';

/** Блок 1: Recently released — одежда */
export default function RecentlyReleasedSection() {
  const { clothing, labels } = useLandingData();

  return (
    <section id="new-arrivals" className={landingSection.section}>
      <div className={landingSection.sectionContent}>
        <h2 className={landingSection.sectionTitle}>{labels.recentlyReleased}</h2>

        <div className={landingSection.productGrid}>
          {clothing?.slice(0, 3).map((product) => (
            <ClothingProductCard
              key={product.title}
              product={product as unknown as CatalogProduct}
            />
          ))}
        </div>

        <div className={landingSection.sectionCta}>
          <Link href="/catalog" className="btn-primary">
            {labels.viewAllProducts}
          </Link>
        </div>
      </div>
    </section>
  );
}
