'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useLandingData } from '@/features/landing/lib/useLandingData';
import FeaturedProductCard from '../FeaturedProductCard/FeaturedProductCard';
import { landingSection } from '../landingSectionClasses';

export default function FeaturedLookSection() {
  const { featuredLook } = useLandingData();

  return (
    <section className={landingSection.section}>
      <div className={landingSection.sectionContent}>
        <div className={landingSection.splitGrid}>
          <Link
            href={featuredLook.product.href}
            className="relative block aspect-3/4 overflow-hidden bg-[#f5f5f5] md:aspect-auto md:min-h-[520px]"
          >
            <Image
              src={featuredLook.editorial.src}
              alt={featuredLook.editorial.alt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </Link>
          <FeaturedProductCard
            href={featuredLook.product.href}
            image={featuredLook.product.image}
            title={featuredLook.product.title}
            price={featuredLook.product.price}
          />
        </div>
      </div>
    </section>
  );
}
