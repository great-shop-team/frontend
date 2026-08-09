'use client';

import Link from 'next/link';

import { useLandingData } from '@/features/landing/lib/useLandingData';
import LandingProductCard from '../LandingProductCard/LandingProductCard';
import { landingSection } from '../landingSectionClasses';

export default function BestSellersSection() {
  const { clothing, labels } = useLandingData();

  return (
    <section id="recently-released" className={landingSection.section}>
      <div className={`${landingSection.sectionContent} flex flex-col gap-8`}>
        <div className="flex items-baseline justify-between gap-4">
          <h2 className={landingSection.sectionTitle}>{labels.recentlyReleased}</h2>
          <Link href="/catalog" className={landingSection.viewAll}>
            {labels.shopAll}
          </Link>
        </div>
        <div className={landingSection.productGrid}>
          {clothing.map((product) => (
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
      </div>
    </section>
  );
}
