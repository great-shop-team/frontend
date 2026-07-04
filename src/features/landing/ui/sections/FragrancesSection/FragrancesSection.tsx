'use client';

import Link from 'next/link';

import { useLandingData } from '@/features/landing/lib/useLandingData';

import FragranceProductCard from './FragranceProductCard';
import { landingSection } from '../landingSectionClasses';

/** Блок 4: Recently released — парфюм */
export default function FragrancesSection() {
  const { fragrances, labels } = useLandingData();

  return (
    <section className={landingSection.section}>
      <div className={landingSection.sectionContent}>
        <div className={landingSection.sectionHeader}>
          <h2 className={`${landingSection.sectionTitle} mb-0`}>{labels.recentlyReleased}</h2>
          <Link href="catalog/accessories" className="btn-outline btn-outline--dark">
            {labels.shopNow}
          </Link>
        </div>
        <div className={landingSection.productGrid}>
          {fragrances.map((product) => (
            <FragranceProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
}
