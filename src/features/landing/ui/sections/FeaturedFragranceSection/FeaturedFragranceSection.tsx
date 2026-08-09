'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useLandingData } from '@/features/landing/lib/useLandingData';
import FeaturedProductCard from '../FeaturedProductCard/FeaturedProductCard';
import { landingSection } from '../landingSectionClasses';

export default function FeaturedFragranceSection() {
  const { featuredFragrance } = useLandingData();

  return (
    <section className={landingSection.section}>
      <div className={landingSection.sectionContent}>
        <div className={landingSection.splitGrid}>
          <FeaturedProductCard
            href={featuredFragrance.product.href}
            image={featuredFragrance.product.image}
            title={featuredFragrance.product.title}
            price={featuredFragrance.product.price}
          />
          <Link
            href={featuredFragrance.product.href}
            className="relative order-first block aspect-3/4 overflow-hidden bg-[#f5f5f5] md:order-0 md:aspect-auto md:min-h-[520px]"
          >
            <Image
              src={featuredFragrance.editorial.src}
              alt={featuredFragrance.editorial.alt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
