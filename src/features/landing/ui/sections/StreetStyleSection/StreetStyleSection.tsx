'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useLandingData } from '@/features/landing/lib/useLandingData';
import { landingSection } from '../landingSectionClasses';

export default function StreetStyleSection() {
  const { streetStyle, labels } = useLandingData();

  return (
    <section className={landingSection.section}>
      <div className={landingSection.sectionContent}>
        <div className={landingSection.sectionHeader}>
          <h2 className={landingSection.sectionTitle}>{labels.streetStyle}</h2>
          <Link href="/catalog" className={landingSection.viewAll}>
            {labels.viewAll}
          </Link>
        </div>
        <div className={landingSection.imageGrid}>
          {streetStyle.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="group relative block aspect-3/4 overflow-hidden bg-[#f5f5f5]"
            >
              <Image
                src={item.image.src}
                alt={item.image.alt}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
